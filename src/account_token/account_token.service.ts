import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTokenEntity } from 'src/account-token/entities/account-token.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class AccountTokenService {
  constructor(
    @InjectRepository(AccountTokenEntity)
    private readonly accountTokenRepository: Repository<AccountTokenEntity>,
  ) {}

  async getAccountToken(accounttokenId: number) {
    const account_token = await this.accountTokenRepository.findOne({
      where: { id: accounttokenId },
    });
    return account_token;
  }

  async saveToken(
    account: AccountEntity,
    tokenKey: string,
    createdby: number,
  ): Promise<AccountTokenEntity> {
    let accountToken = await this.accountTokenRepository.findOne({
      where: { account: { id: account.id } },
    });

    if (accountToken) {
      accountToken.tokenkey = tokenKey; // Sử dụng cùng một mã hóa UUID v4
      accountToken.isactive = 1;
      accountToken.updatedby = createdby;
      accountToken.updatedat = new Date();
    } else {
      accountToken = this.accountTokenRepository.create({
        account,
        tokenkey: tokenKey, // Sử dụng cùng một mã hóa UUID v4
        isactive: 1,
        createdby: createdby,
        createdat: new Date(),
      });
    }

    return await this.accountTokenRepository.save(accountToken);
  }
}
