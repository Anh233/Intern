import { Module } from "@nestjs/common";
import { FilesController } from "./storage-3.controller";
import { StorageS3Service } from "./storage-s3.service";
import { ChatSessionsModule } from "src/chat-session/chat-session.module";

@Module({
  imports: [ChatSessionsModule],
  controllers: [FilesController],
  providers: [StorageS3Service],
  exports: [StorageS3Service],
})
export class StorageS3Module {}