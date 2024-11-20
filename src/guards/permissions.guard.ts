import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChatSessionService } from 'src/chat-session/chat-session.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private chatSessionService: ChatSessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const chatSessionId = request.params.chatSessionId;
    const accountId = request.user.id;

    const chatSession =
      await this.chatSessionService.getChatSessionById(chatSessionId);

    if (chatSession.assignedAccountId !== accountId) {
      throw new HttpException(
        'You do not have permission to access this chat session.',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
