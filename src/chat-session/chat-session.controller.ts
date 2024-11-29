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
import {
  GetChatSessionIdParamDto,
  getChatSessions,
  UpdateChatSessionBodyDto,
} from './dtos/chat-session.dto';
import { Status } from '../enums/status.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/category/category.service';
import { AccountService } from 'src/account/account.service';
import { CheckPermissions } from 'src/decorators/check-permissions.decorator';

@ApiTags('Chat Session')
@Controller('api/v1/chat-session')
export class ChatSessionsController {
  constructor(
    private readonly chatSessionService: ChatSessionService,
    private readonly categoryService: CategoryService,
    private readonly accountService: AccountService,
  ) {}

  @Get(':chatSessionId/detail')
  async getChatSession(@Param() params: GetChatSessionIdParamDto) {
    const chatSessionId = params.chatSessionId;

    return await this.chatSessionService.getChatSessionById(chatSessionId);
  }

  @Get('all')
  async getAllChatSessions(@Query() query: getChatSessions) {
    return await this.chatSessionService.getChatSessions(
      query.accountId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post('create')
  async createChatSession(@Req() req: RequestModel) {
    const reqAccountId = req.user.accountId;
    return await this.chatSessionService.createChatSession(reqAccountId);
  }

  @Get(':status/detail')
  async findChatSessions(@Param('status') status: Status) {
    return await this.chatSessionService.getSessions(status);
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/accept')
  @CheckPermissions()
  async acceptChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const reqAccountId = req.user.accountId;
    const chatSession =
      await this.chatSessionService.getChatSessionById(chatSessionId);

    return this.chatSessionService.acceptChatSession(chatSession, reqAccountId);
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/update')
  async updateChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Body() body: UpdateChatSessionBodyDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const reqAccountId = req.user.accountId;
    const chatSession =
      await this.chatSessionService.getChatSessionById(chatSessionId);
    const category = await this.categoryService.getCategoryById(
      body.categoryId,
    );

    const employeeAccount = await this.accountService.getAccount(
      reqAccountId,
      true,
    );

    return this.chatSessionService.updateChatSession(
      employeeAccount,
      chatSession,
      category,
      reqAccountId,
    );
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/resolve')
  async resolveChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const reqAccountId = req.user.accountId;
    const chatSession =
      await this.chatSessionService.getChatSessionById(chatSessionId);

    return this.chatSessionService.resolveChatSession(
      chatSession,
      reqAccountId,
    );
  }
}
