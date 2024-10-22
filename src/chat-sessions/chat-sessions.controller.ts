import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ChatSessionsService } from './chat-sessions.service';

@Controller('api/v1/chat-session')
export class ChatSessionsController {
  constructor(private readonly chatSessionsService: ChatSessionsService) {}

  @Post('create/:accountId')
  async createChatSession(@Param('accountId') accountId: number) {
    return this.chatSessionsService.createChatSession(accountId);
  }

  @Get(':status')
  async findChatSessions(@Param('status') status: string) {
    return await this.chatSessionsService.getChatSession(status);
  }

  @Put('resolve/:chatSessionId')
  async resolveChatSession(@Param('chatSessionId') chatSessionId: number) {
    return this.chatSessionsService.resolveChatSession(chatSessionId);
  }
}
