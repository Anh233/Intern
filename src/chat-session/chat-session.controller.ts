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
import { Status } from './enums/status.enum';
import { Roles } from 'src/account/decorators/roles.decorator';
import { Role } from 'src/account/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/category/category.service';
import { AccountService } from 'src/account/account.service';

@ApiTags('Chat Session')
@Controller('api/v1/chat-session')
export class ChatSessionsController {
  constructor(
    private readonly chatSessionsService: ChatSessionService,
    private readonly categoryService: CategoryService,
    private readonly accountService: AccountService,
  ) {}

  @Get(':chatSessionId/detail')
  async getChatSession(@Param() params: GetChatSessionIdParamDto) {
    const chatSessionId = params.chatSessionId;

    return await this.chatSessionsService.getChatSessionById(chatSessionId);
  }

  @Get('all')
  async getAllChatSessions(@Query() query: getChatSessions) {
    return await this.chatSessionsService.getChatSessions(
      query.chatSessionId,
      query.accountId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post('create')
  async createChatSession(@Req() req: RequestModel) {
    const reqAccountId = req.user.accountId;
    return await this.chatSessionsService.createChatSession(reqAccountId);
  }

  @Get(':status/detail')
  async findChatSessions(@Param('status') status: Status) {
    return await this.chatSessionsService.getSessions(status);
  }

  @Roles(Role.CustomerService, Role.Admin)
  @Put(':chatSessionId/accept')
  async acceptChatSession(
    @Param() params: GetChatSessionIdParamDto,
    @Req() req: RequestModel,
  ) {
    const chatSessionId = params.chatSessionId;
    const reqAccountId = req.user.accountId;
    const role = req.user.roleId;

    return this.chatSessionsService.acceptChatSession(
      chatSessionId,
      reqAccountId,
      role,
    );
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
      await this.chatSessionsService.getChatSessionById(chatSessionId);
    const category = await this.categoryService.getCategoryById(
      body.categoryId,
    );

    const employeeAccount = await this.accountService.getAccount(
      reqAccountId,
      true,
    );

    return this.chatSessionsService.updateChatSession(
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
      await this.chatSessionsService.getChatSessionById(chatSessionId);

    return this.chatSessionsService.resolveChatSession(
      chatSession,
      reqAccountId,
    );
  }
}
