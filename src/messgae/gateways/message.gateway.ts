import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { MessageService } from '../message.service';

@WebSocketGateway({ namespace: 'message' })
export class MessageGateway {
  @WebSocketServer() server!: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('send_message')
  async sendMessage(
    chatSession: ChatSessionEntity,
    account: AccountEntity,
    message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const newMessage = await this.messageService.sendMessage(
      chatSession.id,
      account.id,
      message,
    );
    this.server
      .to(`chat_session_${chatSession.id}`)
      .emit('new_message', newMessage);
  }

  @SubscribeMessage('join_chat_session')
  sendJoinChatSession(
    @MessageBody() chatSessionId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat_session_${chatSessionId}`);
  }
}
