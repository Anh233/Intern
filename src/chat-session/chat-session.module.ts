import { Module } from '@nestjs/common';
import { ChatSessionsController } from './chat-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionService } from './chat-session.service';
import { ChatSessionEntity } from './entities/chat-session.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CategoryService } from 'src/category/category.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity, AccountEntity]),
    ChatSessionsModule,
    CategoryModule,
  ],
  providers: [ChatSessionService, CategoryService],
  controllers: [ChatSessionsController],
  exports: [ChatSessionService],
})
export class ChatSessionsModule {}
