import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid4 } from 'uuid';
import { AccountTokenService } from 'src/account-token/account-token.service';
import { LoginModel } from './models/login.model';
import { compare } from 'bcrypt';
import { TokenPayloadModel } from './models/token-payload.model';
import { AccountEntity } from 'src/account/entities/account.entity';
import { ConfigService } from '@nestjs/config';
import { throwError } from 'src/utils/function';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly accountTokenService: AccountTokenService,
    private readonly configService: ConfigService,
  ) {}

  async validatedAccount(account: AccountEntity, password: string) {
    if (!account.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return true;
  }

  async login(username: string, password: string): Promise<LoginModel> {
    const account = await this.accountService.getAccountByUsername(username);
    await this.validatedAccount(account, password);

    const tokenKey = uuid4();
    const payload = new TokenPayloadModel(
      account.id,
      account.username,
      tokenKey,
      account.roleId,
    );
    const accessToken = await this.jwtService.signAsync(payload.toJson());
    await this.accountTokenService.saveToken(account, tokenKey, account.id);
    const expiresIn =
      this.configService.get<string>('auth.jwt.signOptions.expiresIn') ??
      throwError();

    return new LoginModel(accessToken, expiresIn);
  }
}
