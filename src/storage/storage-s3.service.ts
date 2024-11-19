import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageS3Service {
  private readonly s3 = new AWS.S3();
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 'http://192.168.1.4:10000',
      accessKeyId: 'uRsbne6cDNXWHGLk',
      secretAccessKey: 'trO8CyQGwLO6UOiHFRUe2kdCJl0UYlOm',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }
  async uploadFile(
    bucketName: string,
    key: string,
    body: Buffer,
    contentType: string,
  ) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };

    await this.s3.upload(params).promise();

    return `${this.s3.config.endpoint}/${bucketName}/${key}`;
  }

  async getPresignedUrl(bucketName: string, key: string) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60,
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }
}
