import { Module } from '@nestjs/common';
import { ChatSessionsController } from './chat-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionsService } from './chat-sessions.service';
import { ChatSessionsEntity } from './entities/chat-sessions.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionsEntity, AccountEntity]),
    ChatSessionsModule,
  ],
  providers: [ChatSessionsService],
  controllers: [ChatSessionsController],
  exports: [ChatSessionsService],
})
export class ChatSessionsModule {}
