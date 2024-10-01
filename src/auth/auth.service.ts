import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import { AccountTokenService } from 'src/account_token/account_token.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly accountTokenService: AccountTokenService,
  ) {}

  async validatedAccount(username: string, password: string): Promise<any> {
    const user = await this.accountService.findOneWithUserName(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.validatedAccount(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Tạo UUID v4
    const uuid = uuidv4();

    // // Mã hóa UUID v4
    // const encryptedUuid = crypto
    //   .createHash('sha256')
    //   .update(uuid)
    //   .digest('hex');

    const payload = {
      username: user.username,
      sub: user.id,
      uuid: uuid,
    };
    const accessToken = this.jwtService.sign(payload);

    await this.accountTokenService.saveToken(user, uuid, user.id);

    return {
      access_token: accessToken,
    };
  }
}
