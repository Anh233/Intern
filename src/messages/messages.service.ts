import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { IsNull, Repository } from 'typeorm';
import { ChatSessionsEntity } from 'src/chat-sessions/entities/chat-sessions.entity';
import { Role } from 'src/account/enums/role.enum';
import { AccountService } from 'src/account/account.service';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
    @InjectRepository(ChatSessionsEntity)
    private readonly chatSessionRepository: Repository<ChatSessionsEntity>,
    @InjectRepository(AccountEntity)
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

  async getMessages(chatSessionId: number) {
    const message = await this.messageRepository.find({
      where: {
        chatSessionId: chatSessionId,
        deletedAt: IsNull(),
      },
    });

    if (!message) {
      throw new HttpException('MESSAGE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return message;
  }

  async checkPermission(accountId: number, chatSessionId: number) {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.status == 'resolved') {
      throw new ForbiddenException(
        'You do not have permission to send messages in a resolved chat session',
      );
    }

    if (chatSession.accountId != accountId) {
      throw new ForbiddenException(
        'You do not have permission to send messages in this chat session',
      );
    }

    const user = await this.accountService.getAccount(accountId);
    const userRole = user.roleId;
    if (userRole !== Role.Admin && userRole !== Role.CustomerService) {
      throw new ForbiddenException(
        'You do not have permission to send messages',
      );
    }
  }

  async sendMessage(
    chatSessionId: number,
    accountId: number,
    message: string,
  ): Promise<MessagesEntity> {
    await this.getChatSessionById(chatSessionId);
    await this.checkPermission(accountId, chatSessionId);
    const text = this.messageRepository.create({
      chatSessionId: chatSessionId,
      accountId: accountId,
      message: message,
    });
    return this.messageRepository.save(text);
  }
}
