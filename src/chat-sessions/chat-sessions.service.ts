import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionsEntity } from './entities/chat-sessions.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ChatSessionsService {
  constructor(
    @InjectRepository(ChatSessionsEntity)
    private readonly chatSessionRepository: Repository<ChatSessionsEntity>,
  ) {}

  async getChatSession(status: string) {
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

  async createChatSession(accountId: number): Promise<ChatSessionsEntity> {
    const chatSession = this.chatSessionRepository.create({
      accountId: accountId,
      status: 'Pending',
    });
    return this.chatSessionRepository.save(chatSession);
  }

  async resolveChatSession(chatSessionId: number): Promise<ChatSessionsEntity> {
    const chatSession = await this.getChatSessionById(chatSessionId);
    chatSession.status = 'Resolved';
    return this.chatSessionRepository.save(chatSession);
  }
}
