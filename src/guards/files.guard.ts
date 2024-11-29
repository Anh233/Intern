import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FilesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<{ maxSize: number; fileTypes: string[] }>(
      'fileRules',
      context.getHandler(),
    );
    if (!rules) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > rules.maxSize) {
      throw new BadRequestException('File size too large');
    }

    if (!rules.fileTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    return true;
  }
}
