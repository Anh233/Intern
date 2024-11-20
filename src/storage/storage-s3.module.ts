import { Module } from '@nestjs/common';
import { StorageS3Service } from './storage-s3.service';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { StorageS3Controller } from './storage-3.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ChatSessionsModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  controllers: [StorageS3Controller],
  providers: [StorageS3Service],
  exports: [StorageS3Service],
})
export class StorageS3Module {}
