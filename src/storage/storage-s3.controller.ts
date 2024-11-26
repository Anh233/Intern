import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { StorageS3Service } from './storage-s3.service';
import { FileRules } from 'src/decorators/files.decorator';
import { multerOptions } from 'src/multers/files.multer';

@ApiTags('File')
@Controller('api/v1/message/images')
export class StorageS3Controller {
  constructor(private readonly storageS3Service: StorageS3Service) {}

  @FileRules(5 * 1024 * 1024, ['image/jpeg', 'image/png', 'image/jpg'])
  @Post('chatSession/:chatSession/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = `${uuidv4()}-${file.originalname}`;

    const fileUrl = await this.storageS3Service.uploadFile(
      fileName,
      file.buffer,
      file.mimetype,
    );

    return {
      message: 'File uploaded successfully',
      url: fileUrl,
    };
  }
}
