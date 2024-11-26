import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './message.controller';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { MessageService } from './message.service';
import { AccountModule } from 'src/account/account.module';
import { MessageGateway } from './gateways/message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    ChatSessionsModule,
    AccountModule,
  ],
  controllers: [MessagesController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessagesModule {}
