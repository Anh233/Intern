import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountTokenEntity } from './entities/account-token.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class AccountTokenService {
  constructor(
    @InjectRepository(AccountTokenEntity)
    private readonly accountTokenRepository: Repository<AccountTokenEntity>,
  ) {}

  async getAccountTokenById(accountTokenId: number) {
    const accountToken = await this.accountTokenRepository.findOne({
      where: {
        id: accountTokenId,
        deletedAt: IsNull(),
      },
    });

    if (!accountToken) {
      throw new HttpException('ACCOUNT_TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return accountToken;
  }

  async getAccountTokenByAccountId(accountId: number) {
    const accountToken = await this.accountTokenRepository.findOne({
      where: {
        accountId: accountId,
        deletedAt: IsNull(),
      },
    });

    if (!accountToken) {
      throw new HttpException('ACCOUNT_TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return accountToken;
  }

  async saveToken(
    account: AccountEntity,
    tokenKey: string,
    roleId: number,
  ): Promise<AccountTokenEntity> {
    let accountToken = await this.accountTokenRepository.findOne({
      where: {
        accountId: account.id,
        deletedAt: IsNull(),
      },
    });

    if (accountToken) {
      accountToken.tokenKey = tokenKey;
      accountToken.isActive = 1;
      accountToken.updatedAt = new Date();
      accountToken.updatedBy = account.id;
    } else {
      accountToken = new AccountTokenEntity();
      accountToken.accountId = account.id;
      accountToken.tokenKey = tokenKey;
      accountToken.isActive = 1;
      accountToken.createdAt = new Date();
      accountToken.createdBy = account.id;
    }

    try {
      const newAccountToken =
        await this.accountTokenRepository.save(accountToken);
      return await this.getAccountTokenById(newAccountToken.id);
    } catch (error) {
      throw new HttpException(
        'FAILED_TO_SAVE_TOKEN',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
