import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type'],
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, payload: { chatSessionId: number }) {
    const chatSessionId = payload.chatSessionId;
    if (!chatSessionId) {
      console.error('chatSessionId is missing or invalid');
      return;
    }
    client.join(chatSessionId.toString());
    console.log(`Client ${client.id} joined chat session: ${chatSessionId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: {
      chatSessionId: number;
      message: string;
      accountId: number;
      imageUrl?: string;
    },
  ) {
    const chatSessionId = payload.chatSessionId;
    console.log('Received payload:', payload.chatSessionId);
    if (isNaN(chatSessionId)) {
      console.error('chatSessionId không hợp lệ hoặc bị thiếu');
      return;
    }

    this.server.to(chatSessionId.toString()).emit('newMessage', {
      chatSessionId,
      accountId: payload.accountId,
      message: payload.message,
      imageUrl: payload.imageUrl,
      timestamp: new Date(),
    });

    console.log(`Message sent to chat session: ${chatSessionId}`);
  }
}
