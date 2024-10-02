import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateAccountBodyDto } from './dtos/account.dto';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('all')
  async getAccounts() {
    return await this.accountService.getAccount(1);
  }

  @Public()
  @Post('create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.email,
      body.phoneNumber,
      body.roleId,
    );
  }

  @Get('update/me')
  async getProfile(@Req() request: RequestModel) {
    const accountId = request.user.accountId;
    return await this.accountService.getAccount(accountId);
  }
}
