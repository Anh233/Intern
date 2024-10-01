import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { LoginBodyDto } from './dtos/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  // Public decorator để route không bị bảo vệ bởi JwtAuthGuard
  @Public()
  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    // Gọi phương thức login từ AuthService

    return await this.authService.login(body.username, body.password);
  }

  // Endpoint này yêu cầu JWT để truy cập
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Trả về thông tin user từ token JWT
    return req.user;
  }
}
