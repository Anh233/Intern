import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  GetChatSessionIdParamsDto,
  GetMessagesQueryDto,
  sendMessageBodyDto,
} from './dtos/messages.dto';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { MessageService } from './message.service';
import { ChatSessionService } from 'src/chat-session/chat-session.service';
import { RequestModel } from 'src/auth/models/request.model';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Message')
@Controller('api/v1/message')
export class MessagesController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatSessionService: ChatSessionService,
  ) {}

  @Roles(Role.User, Role.Admin, Role.CustomerService)
  @Post('chatSession/:chatSessionId/send')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '..', 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async sendMessage(
    @Param() params: GetChatSessionIdParamsDto,
    @Req() req: RequestModel,
    @Body() body: sendMessageBodyDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const chatSessionId = params.chatSessionId;
    const accountId = req.user.accountId;

    await this.chatSessionService.getChatSessionById(chatSessionId);

    let imageUrl: string | undefined = undefined;

    if (image) {
      imageUrl = `/uploads/${image.filename}`;
    }
    return this.messageService.sendMessage(
      chatSessionId,
      accountId,
      body.message,
      imageUrl,
    );
  }

  @Get('chatSession/:chatSessionId/view')
  async getMessages(
    @Param() params: GetChatSessionIdParamsDto,
    @Req() req: RequestModel,
    @Query() query: GetMessagesQueryDto,
  ) {
    const chatSessionId = params.chatSessionId;
    const accountId = req.user.accountId;

    await this.chatSessionService.getChatSessionById(chatSessionId);

    return this.messageService.getMessages(
      chatSessionId,
      accountId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }
}
