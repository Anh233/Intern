import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrimaryColumn, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';

export type User = AccountEntity;

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getAccount(accountId: number) {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
      },
    });
    return account;
  }

  async findOneWithUserName(username: string) {
    return await this.accountRepository.findOne({
      where: { email: username },
    });
  }
}
