import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { MessagesController } from './message.controller';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { AccountModel } from 'src/account/models/account.model';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { AccountService } from 'src/account/account.service';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      ChatSessionEntity,
      AccountEntity,
    ]),
    ChatSessionsModule,
    AccountModel,
  ],
  controllers: [MessagesController],
  providers: [MessageService, AccountService],
  exports: [MessageService],
})
export class MessagesModule {}
