import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('api/v1/message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send/:chatSessionId/:accountId')
  async sendMessage(
    @Param('chatSessionId') chatSessionId: number,
    @Param('accountId') accountId: number,
    @Body('message') message: string,
  ) {
    return this.messagesService.sendMessage(chatSessionId, accountId, message);
  }

  @Get(':chatSessionId')
  async getMessages(@Param('chatSessionId') chatSessionId: number) {
    return await this.messagesService.getMessages(chatSessionId);
  }
}
