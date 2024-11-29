import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import {
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
import { MessageGateway } from './gateways/message.gateway';

@ApiTags('Message')
@Controller('api/v1/message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatSessionService: ChatSessionService,
    private readonly accountService: AccountService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Roles(Role.User, Role.Admin, Role.CustomerService)
  @Post('chatSession/:chatSessionId/send')
  //@CheckPermissions()
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

    const message = await this.messageService.sendMessage(
      chatSession,
      account,
      body.message,
      body.imageUrl,
      reqAccountId,
    );

    //console.log('Emitting newMessage event');

    this.messageGateway.server.to(chatSessionId.toString()).emit('newMessage', {
      chatSessionId,
      accountId: body.accountId,
      message: body.message,
      imageUrl: body.imageUrl,
      timestamp: new Date(),
    });

    return message;
  }

  @Roles(Role.Admin, Role.Operator)
  @Get('chatSession/view')
  async getMessages(@Query() query: GetMessagesQueryDto) {
    return this.messageService.getMessages(
      query.q,
      new PaginationModel(query.page, query.limit),
    );
  }
}
