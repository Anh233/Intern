import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { Roles } from 'src/account/decorators/roles.decorator';
import { Role } from 'src/account/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';
import {
  AcceptChatSessionBodyDto,
  ChatSessionDto,
  CreateChatSessionsBodyDto,
  GetChatSessionIdParamDto,
  GetChatSessionsQueryDto,
  UpdateChatSessionsBodyDto,
} from './dtos/chat-session.dto';
import { Status } from './enums/status.enum';
import { Roles } from 'src/account/decorators/roles.decorator';
import { Role } from 'src/account/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';
import { PaginationModel } from 'src/utils/models/pagination.model';

@Controller('api/v1/chat-session')
export class ChatSessionsController {
  constructor(private readonly chatSessionsService: ChatSessionService) {}

  @Get('all')
  async getAllChatSessions(
    @Req() req: RequestModel,
    @Query() query: GetChatSessionsQueryDto,
  ) {
    const accountId = req.user.accountId;
    const chatSessionId = query.chatSessionId;

    return await this.chatSessionsService.getChatSessions(
      chatSessionId,
      accountId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post('create')
  async createChatSession(@Body() body: CreateChatSessionsBodyDto) {
    const accountId = body.accountId;
    return await this.chatSessionsService.createChatSession(accountId);
  }

  @Get(':status/detail')
  async findChatSessions(@Param('status') status: Status) {
    return await this.chatSessionsService.getStatus(status);
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/accept')
  async acceptChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Body() body: AcceptChatSessionBodyDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const role = req.user.roleId;

    return this.chatSessionsService.acceptChatSession(
      chatSessionId,
      body.assignedId,
      role,
    );
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/update')
  async updateChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Body() body: UpdateChatSessionsBodyDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const role = req.user.roleId;

    return this.chatSessionsService.updateChatSession(
      chatSessionId,
      body.assignedId,
      body.categoryName,
      role,
    );
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/resolve')
  async resolveChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const accountId = req.user.accountId;

    return this.chatSessionsService.resolveChatSession(
      chatSessionId,
      accountId,
    );
  }
}
