import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionEntity } from './entities/chat-session.entity';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Status } from '../enums/status.enum';
import { Role } from 'src/enums/role.enum';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { PageListModel } from 'src/utils/models/page-list.model';
import { ChatSessionModel } from '../utils/models/chat-session.model';
import { CategoryModel } from 'src/utils/models/chat-session.category-type.model';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly chatSessionRepository: Repository<ChatSessionEntity>,
  ) {}

  async getSessions(status: Status | undefined) {
    const chatSessions = await this.chatSessionRepository.find({
      where: {
        status: status,
        deletedAt: IsNull(),
      },
    });

    return chatSessions;
  }

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

  async getChatSessions(
    accountId: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ) {
    const query = this.chatSessionRepository.createQueryBuilder('chatSession');

    if (accountId) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('chatSession.userAccountId = :accountId', {
            accountId,
          }).orWhere('chatSession.assignedId = :accountId', { accountId });
        }),
      );
    }

    if (q) {
      query.andWhere('chatSession.status LIKE :q', { q: `%${q}%` });
    }

    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const chatSessions = data.map(
      (chatSession) =>
        new ChatSessionModel(
          chatSession.id,
          chatSession.userAccountId,
          chatSession.assignedAccountId!,
          chatSession.status,
          chatSession.categoryId!,
        ),
    );
    return new PageListModel<ChatSessionModel>(total, chatSessions);
  }

  async checkChatSession(chatSessionId: number) {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.assignedAccountId !== null) {
      throw new HttpException(
        'This chat session has already been assigned to another agent.',
        HttpStatus.FORBIDDEN,
      );
    }

    return chatSession;
  }

  async checkPermision(chatSessionId: number, accountId: number) {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (chatSession.assignedAccountId !== accountId) {
      throw new HttpException(
        'You do not have permission to access this chat session.',
        HttpStatus.FORBIDDEN,
      );
    }
    return chatSession;
  }

  async createChatSession(reqAccountId: number) {
    const chatSession = new ChatSessionEntity();
    chatSession.userAccountId = reqAccountId;
    chatSession.assignedAccountId = undefined;
    chatSession.status = Status.Pending;
    chatSession.categoryId = 0;
    chatSession.createdBy = reqAccountId;
    chatSession.createdAt = new Date();

    return await this.chatSessionRepository.save(chatSession);
  }

  async acceptChatSession(
    chatSession: ChatSessionEntity,
    reqAccountId: number,
  ): Promise<ChatSessionEntity> {
    await this.checkPermision(chatSession.id, reqAccountId);
    await this.checkChatSession(chatSession.id);

    await this.chatSessionRepository.update(
      {
        id: chatSession.id,
        deletedAt: IsNull(),
      },
      {
        status: Status.InProgress,
        assignedAccountId: reqAccountId,
        updateAt: new Date(),
        updateBy: reqAccountId,
      },
    );

    return this.getChatSessionById(chatSession.id);
  }

  async updateChatSession(
    employeeAccount: AccountEntity,
    chatSession: ChatSessionEntity,
    category: CategoryModel,
    reqAccountId: number,
  ): Promise<ChatSessionEntity> {
    if (
      employeeAccount.roleId === Role.CustomerService &&
      chatSession.assignedAccountId !== employeeAccount.id
    ) {
      throw new HttpException(
        'You do not have permission to access this chat session.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.chatSessionRepository.update(
      {
        id: chatSession.id,
        deletedAt: IsNull(),
      },
      {
        categoryId: category.id,
        updateAt: new Date(),
        updateBy: reqAccountId,
      },
    );

    return this.getChatSessionById(chatSession.id);
  }

  async resolveChatSession(
    chatSession: ChatSessionEntity,
    reqAccountId: number,
  ) {
    if (chatSession.assignedAccountId !== reqAccountId) {
      throw new HttpException(
        'You do not have permission to access this chat session.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (chatSession.status == Status.Resolved) {
      throw new HttpException(
        'Chat session is already resolved',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.chatSessionRepository.update(
      {
        id: chatSession.id,
        deletedAt: IsNull(),
      },
      {
        status: Status.Resolved,
        updateAt: new Date(),
        updateBy: reqAccountId,
        resolvedAt: new Date(),
        resolvedBy: reqAccountId,
      },
    );

    return this.getChatSessionById(chatSession.id);
  }
}
