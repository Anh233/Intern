import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Check Service')
@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async getServiceName(): Promise<string> {
    return await this.appService.getServiceName();
  }
}
