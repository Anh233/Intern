import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetMessagesDto, sendMessageDto } from './dtos/messages.dto';

@Controller('api/v1/message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send/:chatSessionId/:accountId')
  async sendMessage(@Body() body: sendMessageDto) {
    return this.messagesService.sendMessage(
      body.chatSessionId,
      body.accountId,
      body.message,
    );
  }

  @Get(':chatSessionId')
  async getMessages(@Body() body: GetMessagesDto) {
    return await this.messagesService.getMessages(body.chatSessionId);
  }
}
