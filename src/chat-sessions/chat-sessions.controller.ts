import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ChatSessionsService } from './chat-sessions.service';
import {
  AcceptChatSessionBodyDto,
  CreateChatSessionsBodyDto,
  UpdateChatSessionsBodyDto,
} from './dtos/chat-sessions.dto';
import { Status } from './enums/status.enum';
import { Roles } from 'src/account/decorators/roles.decorator';
import { Role } from 'src/account/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';

@Controller('api/v1/chat-session')
export class ChatSessionsController {
  constructor(private readonly chatSessionsService: ChatSessionsService) {}

  @Post('create')
  async createChatSession(@Body() body: CreateChatSessionsBodyDto) {
    const accountId = body.accountId; // Lấy accountId từ body
    return await this.chatSessionsService.createChatSession(accountId);
  }

  @Get(':status')
  async findChatSessions(@Param('status') status: Status) {
    return await this.chatSessionsService.getChatSession(status);
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/accept')
  async acceptChatSession(
    @Param('chatSessionId') chatSessionId: number,
    @Body() body: AcceptChatSessionBodyDto,
    @Req() req: RequestModel,
  ) {
    const role = req.user.roleId;
    return this.chatSessionsService.acceptChatSession(
      chatSessionId,
      body.category,
      body.assignedId,
      role,
    );
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/update')
  async updateChatSession(
    @Param('chatSessionId') chatSessionId: number,
    @Body() body: UpdateChatSessionsBodyDto,
    @Req() req: RequestModel,
  ) {
    const role = req.user.roleId;
    return this.chatSessionsService.updateChatSession(
      chatSessionId,
      body.category,
      body.assignedId,
      role,
    );
  }
}
