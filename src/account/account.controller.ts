import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('all')
  async getAccounts() {
    return await this.accountService.getAccount(1);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request: RequestWithUser) {
    const user = request.user;
    const accountId = user.id;
    return await this.accountService.getAccount(accountId);
  }
}
