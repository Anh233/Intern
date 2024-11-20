import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageS3Service {
  private readonly bucketName = 'public';
  private readonly s3 = new AWS.S3();
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 'http://192.168.1.4:10000',
      accessKeyId: 'uRsbne6cDNXWHGLk',
      secretAccessKey: 'trO8CyQGwLO6UOiHFRUe2kdCJl0UYlOm',
      s3ForcePathStyle: true,
      // signatureVersion: 'v4',
    });
  }
  async uploadFile(fileName: string, buffer: Buffer, contentType: string) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    };

    await this.s3.upload(params).promise();

    return `${this.s3.config.endpoint}/${this.bucketName}/${fileName}`;
  }

  async getPresignedUrl(bucketName: string, fileName: string) {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60,
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }
}
