import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { AccountModule } from 'src/account/account.module';
import { MessageGateway } from './gateways/message.gateway';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    ChatSessionsModule,
    AccountModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
