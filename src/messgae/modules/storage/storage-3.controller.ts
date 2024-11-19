import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { StorageS3Service } from './storage-s3.service';

@ApiTags('Image')
@Controller('api/v1/message/images')
export class FilesController {
  constructor(private readonly storageS3Service: StorageS3Service) {}

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
