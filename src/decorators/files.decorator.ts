import { SetMetadata } from '@nestjs/common';

export const FileRules = (maxSize: number, fileTypes: string[]) =>
  SetMetadata('fileRules', { maxSize, fileTypes });
