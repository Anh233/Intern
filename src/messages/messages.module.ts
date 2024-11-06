import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { AccountModel } from 'src/account/models/account.model';
import { ChatSessionsEntity } from 'src/chat-session/entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      ChatSessionsEntity,
      AccountEntity,
    ]),
    ChatSessionsModule,
    AccountModel,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
