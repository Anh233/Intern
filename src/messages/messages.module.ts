import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { MessagesController } from './messages.controller';
<<<<<<< HEAD
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { AccountModel } from 'src/account/models/account.model';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { MessageService } from './messages.service';
=======
import { MessagesService } from './messages.service';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { AccountModel } from 'src/account/models/account.model';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { AccountService } from 'src/account/account.service';
>>>>>>> feat/func

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      ChatSessionEntity,
      ChatSessionEntity,
      AccountEntity,
    ]),
    ChatSessionsModule,
    AccountModel,
  ],
  controllers: [MessagesController],
<<<<<<< HEAD
  providers: [MessageService],
=======
  providers: [MessageService, AccountService],
>>>>>>> feat/func
  exports: [MessageService],
})
export class MessagesModule {}
