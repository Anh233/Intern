import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid4 } from 'uuid';
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

  async validatedAccount(username: string, password: string) {
    const account = await this.accountService.getAccountByUsername(username);

    if (!account) {
      throw new UnauthorizedException('Account does not exist');
    }

    const isPasswordValid = await compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!account.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    return account;
  }

  async login(username: string, password: string): Promise<any> {
    await this.validatedAccount(username, password);
    const account = await this.accountService.getAccountByUsername(username);

    const tokenKey = uuid4();
    const payload = new TokenPayloadModel(
      account.id,
      account.username,
      tokenKey,
      account.roleId,
    ).ChangeObject();
    const accessToken = await this.jwtService.signAsync(payload);

    await this.accountTokenService.saveToken(account, tokenKey, account.id);

    return new LoginModel(accessToken, '7d');
  }
}
