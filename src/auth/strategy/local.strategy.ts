import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const account = await this.accountService.getAccountByUsername(username);
    await this.authService.validatedAccount(account, password);
    return true;
  }
}
