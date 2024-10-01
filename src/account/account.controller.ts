import { Controller, Get, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('all')
  async getAccounts() {
    return await this.accountService.getAccount(1);
  }

  @Get('profile')
  async getProfile(@Req() request: RequestModel) {
    const accountId = request.user.accountId;
    return await this.accountService.getAccount(accountId);
  }
}
