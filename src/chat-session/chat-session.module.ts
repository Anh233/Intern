import { forwardRef, Module } from '@nestjs/common';
import { ChatSessionsController } from './chat-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionService } from './chat-session.service';
import { ChatSessionEntity } from './entities/chat-session.entity';
import { CategoryModule } from 'src/category/category.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity]),
    forwardRef(() => CategoryModule),
    forwardRef(() => AccountModule),
  ],
  providers: [ChatSessionService],
  controllers: [ChatSessionsController],
  exports: [ChatSessionService],
})
export class ChatSessionsModule {}
