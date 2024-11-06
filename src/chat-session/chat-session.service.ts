import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionEntity } from './entities/chat-session.entity';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Status } from './enums/status.enum';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Role } from 'src/account/enums/role.enum';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { PageListModel } from 'src/utils/models/page-list.model';
import { ChatSessionModel } from './models/chat-session.model';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly chatSessionRepository: Repository<ChatSessionEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    private readonly categoryService: CategoryService,
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

  async getChatSessionById(chatSessionId: number): Promise<ChatSessionEntity> {
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

  async checkChatSession(chatSessionId: number): Promise<ChatSessionEntity> {
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
  ): Promise<ChatSessionEntity> {
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

  async createChatSession(accountId: number): Promise<ChatSessionEntity> {
    const chatSession = new ChatSessionEntity();
    chatSession.userAccountId = accountId;
    chatSession.assignedId = undefined;
    chatSession.status = Status.Pending;
    chatSession.categoryId = this.categoryService.getDefaultCategoryId();
    chatSession.createdBy = accountId;
    chatSession.createdAt = new Date();

    return await this.chatSessionRepository.save(chatSession);
  }

  async acceptChatSession(
    chatSessionId: number,
    assignedId: number,
    role: Role,
  ): Promise<ChatSessionEntity> {
    await this.getChatSessionById(chatSessionId);
    await this.CheckPermision(chatSessionId, assignedId, role);
    await this.checkChatSession(chatSessionId);

    await this.chatSessionRepository.update(chatSessionId, {
      status: Status.InProgress,
      assignedId: assignedId,
    });

    return this.getChatSessionById(chatSessionId);
  }

  async updateChatSession(
    chatSessionId: number,
    categoryId: number,
    assignedId: number,
    role: Role,
  ): Promise<ChatSessionEntity> {
    const chatSession = await this.getChatSessionById(chatSessionId);

    if (role === Role.Admin) {
      chatSession.categoryId = categoryId;
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
      chatSession.categoryId = categoryId;
      chatSession.updateAt = new Date();
      chatSession.updateBy = assignedId;
      return this.chatSessionRepository.save(chatSession);
    }
    throw new HttpException(
      'You do not have permission to access this chat session.',
      HttpStatus.FORBIDDEN,
    );
  }

  async getChatSessions(
    chatSessionId: number,
    userAccountId: number | undefined,
    assignedId: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ) {
    const query = this.chatSessionRepository.createQueryBuilder('chatSession');
    await this.getChatSessionById(chatSessionId);

    if (chatSessionId) {
      query.andWhere('chatSession.chatSessionId = :chatSessionId', {
        chatSessionId,
      });
    }
    if (userAccountId) {
      query.andWhere('chatSession.userAccountId = :userAccountId', {
        userAccountId,
      });
    }
    if (assignedId) {
      query.andWhere('chatSession.assigned = :assignedId', { assignedId });
    }
    if (q) {
      new Brackets((qb) => {
        qb.andWhere('chatSession.status LIKE :q', { q: `%${q}%` }).orWhere(
          'chatSession.categoryId LIKE :q',
          { q: `%${q}%` },
        );
      });
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
          chatSession.assignedId!, //cần kiểm tra chắc chắn phải có assignedId trước khi vào hàm.
          chatSession.status,
          chatSession.categoryId!,
        ),
    );
    return new PageListModel<ChatSessionModel>(total, chatSessions);
  }
}
