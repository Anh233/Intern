import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/messages.entity';
import { MessagesController } from './message.controller';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { MessageService } from './message.service';
import { MessageGateway } from './gateways/message.gateway';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), ChatSessionsModule, AccountModule],
  controllers: [MessagesController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessagesModule {}
