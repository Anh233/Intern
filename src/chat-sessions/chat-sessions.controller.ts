import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ChatSessionsService } from './chat-sessions.service';
import {
  AcceptChatSessionBodyDto,
  CreateChatSessionsBodyDto,
  UpdateChatSessionsBodyDto,
} from './dtos/chat-sessions.dto';

@Controller('api/v1/chat-session')
export class ChatSessionsController {
  constructor(private readonly chatSessionsService: ChatSessionsService) {}

  @Post('create/:accountId')
  async createChatSession(@Body() body: CreateChatSessionsBodyDto) {
    return this.chatSessionsService.createChatSession(body.accountId);
  }

  @Get(':status')
  async findChatSessions(@Param('status') status: string) {
    return await this.chatSessionsService.getChatSession(status);
  }

  @Put('accept/:chatSessionId')
  async acceptChatSession(@Body() body: AcceptChatSessionBodyDto) {
    return this.chatSessionsService.acceptChatSession(
      body.chatSessionId,
      body.status,
      body.category,
    );
  }

  @Put('update/:chatSessionId')
  async updateChatSession(@Body() body: UpdateChatSessionsBodyDto) {
    return this.chatSessionsService.updateChatSession(
      body.chatSessionId,
      body.status,
      body.category,
    );
  }
}
