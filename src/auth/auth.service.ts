import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AccountTokenService } from 'src/account-token/account-token.service';
import { LoginModel } from './models/login.model';
import { compare } from 'bcrypt';
import { TokenPayloadModel } from './models/token-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly accountTokenService: AccountTokenService,
  ) {}

  async validatedAccount(username: string, password: string): Promise<boolean> {
    const user = await this.accountService.getAccountByUsername(username);
    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new UnauthorizedException();
    }

    return true;
  }

  async login(username: string, password: string): Promise<any> {
    await this.validatedAccount(username, password);
    const account = await this.accountService.getAccountByUsername(username);

    const tokenKey = uuidv4();
    const payload = new TokenPayloadModel(account.id, tokenKey, account.roleId);
    const accessToken = await this.jwtService.signAsync(payload);

    await this.accountTokenService.saveToken(account, tokenKey, account.id);

    return new LoginModel(accessToken, '7d');
  }
}
