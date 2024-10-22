import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
  ) {}

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

  async sendMessage(
    chatSessionId: number,
    accountId: number,
    message: string,
  ): Promise<MessagesEntity> {
    const text = this.messageRepository.create({
      chatSessionId: chatSessionId,
      accountId: accountId,
      message: message,
    });
    return this.messageRepository.save(text);
  }
}
