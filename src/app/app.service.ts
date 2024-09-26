import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { throwError } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getServiceName(): Promise<string> {
    return this.configService.get<string>('app.name');
  }
}
