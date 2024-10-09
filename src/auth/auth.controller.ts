import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';
import { Public } from './decorators/public.decorator';
import { LoginBodyDto } from './dtos/auth.dto';
import { RequestModel } from './models/request.model';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    return await this.authService.login(body.username, body.password);
  }

  @Get('profile')
  async getProfile(@Req() req: RequestModel) {
    return req.user;
  }
}
