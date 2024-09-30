import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authSerVice: AuthService,
    private userService: AccountService,
  ) {}

  // Public decorator để route không bị bảo vệ bởi JwtAuthGuard
  @Public()
  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // Gọi phương thức login từ AuthService
    return await this.authSerVice.login(req.body.username, req.body.password);
  }

  // Endpoint này yêu cầu JWT để truy cập
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Trả về thông tin user từ token JWT
    return req.user;
  }
}
