import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('all')
  async getAccounts() {
    return await this.accountService.getAccount(1);
  }
}
