import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { IsNull, Like, Repository } from 'typeorm';
import { ChatSessionsEntity } from 'src/chat-sessions/entities/chat-sessions.entity';
import { Role } from 'src/account/enums/role.enum';
import { AccountEntity } from 'src/account/entities/account.entity';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { MessageModel } from './models/message.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
    @InjectRepository(ChatSessionsEntity)
    private readonly chatSessionRepository: Repository<ChatSessionsEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
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

  async getAccount(accountId: number): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, deletedAt: IsNull() },
    });

    if (!account) {
      throw new HttpException('ACCOUNT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async checkPermissionForSend(accountId: number, chatSessionId: number) {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.status == 'resolved') {
      throw new ForbiddenException(
        'You do not have permission to send messages in a resolved chat session',
      );
    }

    const user = await this.getAccount(accountId);
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

    const user = await this.getAccount(accountId);
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
  ): Promise<MessagesEntity> {
    await this.getChatSessionById(chatSessionId);
    await this.checkPermissionForSend(accountId, chatSessionId);
    const text = this.messageRepository.create({
      chatSessionId: chatSessionId,
      accountId: accountId,
      message: message,
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
}
