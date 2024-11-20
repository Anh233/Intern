import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import {
  GetMessagesParamsDto,
  GetMessagesQueryDto,
  GetSendMessagesParamsDto,
  sendMessageBodyDto,
} from './dtos/messages.dto';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { MessageService } from './message.service';
import { ChatSessionService } from 'src/chat-session/chat-session.service';
import { RequestModel } from 'src/auth/models/request.model';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from 'src/account/account.service';
import { CheckPermissions } from 'src/decorators/check-permissions.decorator';

@ApiTags('Message')
@Controller('api/v1/message')
export class MessagesController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatSessionService: ChatSessionService,
    private readonly accountService: AccountService,
  ) {}

  @Roles(Role.User, Role.Admin, Role.CustomerService)
  @Post('chatSession/:chatSessionId/send')
  @CheckPermissions()
  async sendMessage(
    @Param() params: GetSendMessagesParamsDto,
    @Req() req: RequestModel,
    @Body() body: sendMessageBodyDto,
  ) {
    const chatSessionId = params.chatSessionId;
    const reqAccountId = req.user.accountId;

    const chatSession =
      await this.chatSessionService.getChatSessionById(chatSessionId);
    const account = await this.accountService.getAccount(body.accountId, true);

    return this.messageService.sendMessage(
      chatSession,
      account,
      body.message,
      body.imageUrl,
      reqAccountId,
    );
  }

  @Roles(Role.Admin, Role.Operator)
  @Get('chatSession/:chatSessionId/view')
  async getMessages(
    @Param() params: GetMessagesParamsDto,
    @Req() req: RequestModel,
    @Query() query: GetMessagesQueryDto,
  ) {
    const chatSessionId = params.chatSessionId;
    const accountId = req.user.accountId;

    const chatSession =
      await this.chatSessionService.getChatSessionById(chatSessionId);

    return this.messageService.getMessages(
      chatSession,
      query.q,
      new PaginationModel(query.page, query.limit),
      accountId,
    );
  }
}
