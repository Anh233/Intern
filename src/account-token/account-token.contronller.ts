import { Controller, Get } from '@nestjs/common';
import { AccountTokenService } from './account-token.service';

@Controller('api/v1/account')
export class AccountTokenController {
  constructor(private readonly accountTokenService: AccountTokenService) {}

  @Get('tokens')
  async getAccountTokens() {
    return await this.accountTokenService.getAccountTokenById(1);
  }
}
