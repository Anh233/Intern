import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { LoginBodyDto } from './dtos/auth.dto';
import { CreateAccountBodyDto } from 'src/account/dtos/account.dto';
import { UpdateAccountBodyDto } from '../account/dtos/account.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update')
  async updateAccount(@Request() req, @Body() body: UpdateAccountBodyDto) {
    try {
      const accountId = req.user.id;
      return await this.accountService.updateAccount(accountId, body);
    } catch (error) {
      console.error('Error updating account:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
