import {
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageS3Service } from './storage-s3.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUploadImageParamsDto } from './dtos/storage.dto';
import { ChatSessionService } from 'src/chat-session/chat-session.service';
import { Account } from 'aws-sdk';
import { RequestModel } from 'src/auth/models/request.model';

@ApiTags('Image')
@Controller('api/v1/message/images')
export class FilesController {
  constructor(
    private readonly storageS3Service: StorageS3Service,
    private readonly chatSessionService: ChatSessionService,
  ) {}

  @Post('chatSession/:chatSession/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bucketName = 'public';
    const key = `${Date.now()}-${file.originalname}`;

    const fileUrl = await this.storageS3Service.uploadFile(
      bucketName,
      key,
      file.buffer,
      file.mimetype,
    );

    return {
      message: 'File uploaded successfully',
      url: fileUrl,
    };
  }
}
