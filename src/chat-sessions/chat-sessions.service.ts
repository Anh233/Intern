import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionsEntity } from './entities/chat-sessions.entity';
import { IsNull, Repository } from 'typeorm';
import { Status } from './enums/status.enum';
import { Category } from './enums/categories.enum';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Role } from 'src/account/enums/role.enum';

@Injectable()
export class ChatSessionsService {
  constructor(
    @InjectRepository(ChatSessionsEntity)
    private readonly chatSessionRepository: Repository<ChatSessionsEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getChatSession(status: Status) {
    const chatSession = await this.chatSessionRepository.findOne({
      where: {
        status: status,
        deletedAt: IsNull(),
      },
    });

    if (!chatSession) {
      throw new HttpException('SESSION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return chatSession;
  }

  async getChatSessionById(chatSessionId: number): Promise<ChatSessionsEntity> {
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

  async checkChatSession(chatSessionId: number): Promise<ChatSessionsEntity> {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.assignedId !== null) {
      throw new HttpException(
        'This chat session has already been assigned to another agent.',
        HttpStatus.FORBIDDEN,
      );
    }

    return chatSession;
  }

  async CheckPermision(
    chatSessionId: number,
    accountId: number,
    role: Role,
  ): Promise<ChatSessionsEntity> {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (
      role !== Role.Admin &&
      role !== Role.CustomerService &&
      chatSession.assignedId !== accountId
    ) {
      throw new HttpException(
        'You do not have permission to access this chat session.',
        HttpStatus.FORBIDDEN,
      );
    }

    return chatSession;
  }

  async createChatSession(accountId: number): Promise<ChatSessionsEntity> {
    const chatSession = new ChatSessionsEntity();
    chatSession.customerId = accountId;
    chatSession.assignedId = undefined;
    chatSession.status = Status.Pending;
    chatSession.category = Category.General;
    chatSession.isResolved = 0;
    chatSession.createdBy = accountId;
    chatSession.createdAt = new Date();

    return await this.chatSessionRepository.save(chatSession);
  }

  async acceptChatSession(
    chatSessionId: number,
    category: string,
    assignedId: number,
    role: Role,
  ): Promise<ChatSessionsEntity> {
    await this.getChatSessionById(chatSessionId);
    await this.CheckPermision(chatSessionId, assignedId, role);
    await this.checkChatSession(chatSessionId);

    await this.chatSessionRepository.update(chatSessionId, {
      status: Status.InProgress,
      category: category,
      assignedId: assignedId,
    });

    return this.getChatSessionById(chatSessionId);
  }

  async updateChatSession(
    chatSessionId: number,
    category: string,
    assignedId: number,
    role: Role,
  ): Promise<ChatSessionsEntity> {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (role === Role.Admin) {
      chatSession.category = category;
      chatSession.updateAt = new Date();
      chatSession.updateBy = assignedId;
      return this.chatSessionRepository.save(chatSession);
    }

    if (role === Role.CustomerService) {
      if (chatSession.assignedId !== assignedId) {
        throw new HttpException(
          'You do not have permission to access this chat session.',
          HttpStatus.FORBIDDEN,
        );
      }
      chatSession.category = category;
      chatSession.updateAt = new Date();
      chatSession.updateBy = assignedId;
      return this.chatSessionRepository.save(chatSession);
    }
    throw new HttpException(
      'You do not have permission to access this chat session.',
      HttpStatus.FORBIDDEN,
    );
  }
}
