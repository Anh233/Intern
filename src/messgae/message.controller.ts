import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  GetMessagesQueryDto,
  sendMessageDto,
} from './dtos/messages.dto';
import { MessageModel } from './models/message.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { Role } from 'src/account/enums/role.enum';
import { Roles } from 'src/account/decorators/roles.decorator';
import { MessageService } from './message.service';

@Controller('api/v1/message')
export class MessagesController {
  constructor(private readonly messageService: MessageService) {}

  @Roles(Role.User, Role.Admin, Role.CustomerService)
  @Post(':chatSessionId/:accountId/send')
  async sendMessage(
    @Param('chatSessionId') chatSessionId: number,
    @Param('accountId') accountId: number,
    @Body() body: sendMessageDto,
  ) {
    return this.messageService.sendMessage(
      chatSessionId,
      accountId,
      body.message,
      body.imageUrl,
    );
  }

  @Get(':chatSessionId/:accountId/view')
  async getMessages(
    @Param('chatSessionId') chatSessionId: number,
    @Param('accountId') accountId: number,
    @Query() query: GetMessagesQueryDto,
  ): Promise<{ data: MessageModel[]; total: number }> {
    return this.messageService.getMessages(
      chatSessionId,
      accountId,
      new PaginationModel(query.page, query.limit),
      undefined,
    );
  }
}
