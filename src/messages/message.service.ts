import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { IsNull, Like, Repository } from 'typeorm';
import { Role } from 'src/account/enums/role.enum';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { MessageModel } from './models/message.model';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
    @InjectRepository(ChatSessionEntity)
    private readonly chatSessionRepository: Repository<ChatSessionEntity>,
    @Inject(AccountService)
    private readonly accountService: AccountService,
  ) {}

  async getChatSessionById(chatSessionId: number) {
    const chatSession = await this.chatSessionRepository.findOne({
      where: {
        id: chatSessionId,
        deletedAt: IsNull(),
      },
    });

    if (!chatSession) {
      throw new HttpException('SESSION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return chatSession;
  }

  async checkPermissionForSend(accountId: number, chatSessionId: number) {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.status == 'resolved') {
      throw new ForbiddenException(
        'You do not have permission to send messages in a resolved chat session',
      );
    }

    const user = await this.accountService.getAccount(accountId, true);
    const userRole = user.roleId;

    if (userRole == Role.Admin) {
      return;
    }

    if (chatSession.assignedId !== accountId) {
      throw new ForbiddenException(
        'You do not have permission to send messages in this chat session',
      );
    }
  }

  async checkPermissionForView(accountId: number, chatSessionId: number) {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.status === 'resolved') {
      throw new ForbiddenException(
        'You do not have permission to view messages in a resolved chat session',
      );
    }

    const user = await this.accountService.getAccount(accountId, true);
    const userRole = user.roleId;

    if (userRole == Role.Admin || userRole == Role.Operator) {
      return;
    }

    if (chatSession.assignedId !== accountId) {
      throw new ForbiddenException(
        'You do not have permission to view messages in this chat session',
      );
    }
  }

  async sendMessage(
    chatSessionId: number,
    accountId: number,
    message: string,
    imageUrl: string | undefined,
  ): Promise<MessagesEntity> {
    await this.getChatSessionById(chatSessionId);
    await this.checkPermissionForSend(accountId, chatSessionId);
    const text = this.messageRepository.create({
      chatSessionId: chatSessionId,
      accountId: accountId,
      message: message,
      imageUrl: imageUrl,
      createdBy: accountId,
    });
    return this.messageRepository.save(text);
  }

  async getMessages(
    chatSessionId: number,
    accountId: number,
    pagination: PaginationModel,
    query?: string,
  ): Promise<{ data: MessageModel[]; total: number }> {
    await this.getChatSessionById(chatSessionId);
    await this.checkPermissionForView(accountId, chatSessionId);

    const whereConditions: any = {
      chatSessionId: chatSessionId,
      deletedAt: IsNull(),
    };

    if (query) {
      whereConditions.message = Like(`%${query}%`);
    }

    const [messages, total] = await this.messageRepository.findAndCount({
      where: whereConditions,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { createdAt: 'ASC' },
    });

    const messageModels = messages.map(
      (message) =>
        new MessageModel(
          message.id,
          message.chatSessionId,
          message.accountId,
          message.message,
        ),
    );

    return { data: messageModels, total };
  }

  async getChatHistory(chatSessionId: number) {
    return await this.getChatSessionById(chatSessionId);
  }
}
