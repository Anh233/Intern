import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetMessagesQueryDto, sendMessageDto } from './dtos/messages.dto';
import { MessageModel } from './models/message.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { Role } from 'src/account/enums/role.enum';
import { Roles } from 'src/account/decorators/roles.decorator';

@Controller('api/v1/message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Roles(Role.User, Role.Admin, Role.CustomerService)
  @Post(':chatSessionId/:accountId/send')
  async sendMessage(
    @Param('chatSessionId') chatSessionId: number,
    @Param('accountId') accountId: number,
    @Body() body: sendMessageDto,
  ) {
    return this.messagesService.sendMessage(
      chatSessionId,
      accountId,
      body.message,
    );
  }

  @Get(':chatSessionId/:accountId/view')
  async getMessages(
    @Param('chatSessionId') chatSessionId: number,
    @Param('accountId') accountId: number,
    @Query() query: GetMessagesQueryDto,
  ): Promise<{ data: MessageModel[]; total: number }> {
    return this.messagesService.getMessages(
      chatSessionId,
      accountId,
      new PaginationModel(query.page, query.limit),
      undefined,
    );
  }
}
