import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { MessageEntity } from './entities/messages.entity';
import { MessageModel } from '../utils/models/message.model';
import { ChatSessionService } from 'src/chat-session/chat-session.service';
import { PageListModel } from 'src/utils/models/page-list.model';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @Inject(ChatSessionService)
    private readonly chatSessionService: ChatSessionService,
  ) {}

  async sendMessage(
    chatSession: ChatSessionEntity,
    account: AccountEntity,
    message: string,
    imageUrl: string | undefined,
    reqAccountId: number,
  ) {

    const newMessage = new MessageEntity();
    newMessage.chatSessionId = chatSession.id;
    newMessage.accountId = account.id;
    newMessage.message = message;
    newMessage.imageUrl = imageUrl;
    newMessage.createdAt = new Date();
    newMessage.createdBy = reqAccountId;

    return this.messageRepository.save(newMessage);
  }

  async getMessages(
    chatSession: ChatSessionEntity,
    q: string | undefined,
    pagination: PaginationModel,
    reqAccountId: number,
  ) {

    const query = this.messageRepository.createQueryBuilder('message');

    if (q) {
      query.andWhere('message.message LIKE :q', { q: `%${q}%` });
    }

    const [data, total] = await query
      .orderBy('message.createdAt', 'DESC')
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
          message.imageUrl,
          message.createdAt,
          message.createdBy,
        ),
    );

    return new PageListModel<MessageModel>(total, messages);
  }
}
