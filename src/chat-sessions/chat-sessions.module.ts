import { Module } from '@nestjs/common';
import { ChatSessionsController } from './chat-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionsService } from './chat-sessions.service';
import { ChatSessionsEntity } from './entities/chat-sessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionsEntity])],
  providers: [ChatSessionsService],
  controllers: [ChatSessionsController],
})
export class ChatSessionsModule {}
