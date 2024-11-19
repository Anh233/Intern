import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { MessageEntity } from './entities/messages.entity';
import { MessageModel } from '../utils/models/message.model';
import { ChatSessionService } from 'src/chat-session/chat-session.service';
import { PageListModel } from 'src/utils/models/page-list.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @Inject(ChatSessionService)
    private readonly chatSessionService: ChatSessionService,
  ) {}

  async sendMessage(
    chatSessionId: number,
    accountId: number,
    message: string,
    imageUrl?: string | undefined,
    reqAccountId: number,
  ) {
    await this.chatSessionService.checkPermision(chatSessionId, reqAccountId);
    const newMessage = new MessageEntity();
    newMessage.chatSessionId = chatSessionId;
    newMessage.accountId = reqAccountId;
    newMessage.message = message;
    newMessage.imageUrl = imageUrl;
    newMessage.createdAt = new Date();
    newMessage.createdBy = reqAccountId;

    return this.messageRepository.save(newMessage);
  }

  async getMessages(
    chatSessionId: number,
    q?: string,
    pagination: PaginationModel,
    reqAccountId: number,
  ) {
    await this.chatSessionService.checkPermision(chatSessionId, reqAccountId);

    const query = this.messageRepository.createQueryBuilder('message');

    if (q) {
      query.andWhere('message.message LIKE :q', { q: `%${q}%` });
    }

    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const messages = data.map(
      (message) =>
        new MessageModel(
          message.id,
          message.chatSessionId,
          message.accountId,
          message.message,
          message.createdAt,
          message.createdBy,
        ),
    );

    return new PageListModel<MessageModel>(total, messages);
  }
}
