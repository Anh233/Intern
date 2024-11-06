import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatSessionService } from '../chat-session.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server | undefined;

  constructor(private readonly chatSessionService: ChatSessionService) {}

  // // Xử lý gửi tin nhắn
  // @SubscribeMessage('sendMessage')
  // async handleSendMessage(@MessageBody() createMessageDto) {
  //   const message = await this.chatSessionService.sendMessage(createMessageDto);
  //   this.server.emit('receiveMessage', message);
  //   return message;
  // }

  // // Xử lý đánh dấu tin nhắn
  // @SubscribeMessage('markMessage')
  // async handleMarkMessage(@MessageBody() markMessageDto) {
  //   const { messageId, markType } = markMessageDto; // markType có thể là loại đánh dấu như "important", "read", v.v.
  //   const markedMessage = await this.chatSessionService.markMessage(messageId, {
  //     markType,
  //   });
  //   this.server.emit('messageMarked', { messageId, markType });
  //   return markedMessage;
  // }

  // // Xử lý phân loại tin nhắn
  // @SubscribeMessage('categorizeMessage')
  // async handleCategorizeMessage(@MessageBody() categorizeMessageDto) {
  //   const { messageId, categoryId } = categorizeMessageDto;
  //   const categorizedMessage = await this.chatSessionService.categorizeMessage(
  //     messageId,
  //     categoryId,
  //   );
  //   this.server.emit('messageCategorized', { messageId, categoryId });
  //   return categorizedMessage;
  // }

  // // Xem lịch sử chat theo phiên chat
  // @SubscribeMessage('getChatHistory')
  // async handleGetChatHistory(@MessageBody() chatSessionId: number) {
  //   const messages =
  //     await this.chatSessionService.getChatHistory(chatSessionId);
  //   return { chatSessionId, messages };
  // }
}
