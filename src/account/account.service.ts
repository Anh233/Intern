import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { hash } from 'bcrypt';

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
        deletedAt: IsNull(),
      },
    });

    if (!account) {
      throw new HttpException('ACCOUNT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async getAccountByUsername(username: string) {
    const account = await this.accountRepository.findOne({
      where: {
        username: username,
        deletedAt: IsNull(),
      },
    });

    if (!account) {
      throw new HttpException('ACCOUNT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async createAccount(
    username: string,
    password: string,
    email: string,
    phoneNumber: string,
    roleId: number,
  ): Promise<AccountEntity> {
    const hashedPassword = await hash(password, 10);

    const newAccount = new AccountEntity();
    newAccount.username = username;
    newAccount.password = hashedPassword;
    newAccount.email = email;
    newAccount.phoneNumber = phoneNumber;
    newAccount.roleId = roleId;
    newAccount.isActive = 1;
    newAccount.createdAt = new Date();

    return await this.accountRepository.save(newAccount);
  }

  async updateAccount(
    account: AccountEntity,
    password: string | undefined,
    email: string | undefined,
    phoneNumber: string | undefined,
    roleId: number | undefined,
    reqAccountId: number,
  ): Promise<AccountEntity> {
    const passwordHash = password ? await hash(password, 10) : undefined;
    await this.accountRepository.update(
      {
        id: account.id,
        deletedAt: IsNull(),
      },
      {
        email: email,
        phoneNumber: phoneNumber,
        roleId: roleId,
        password: passwordHash,
        updateAt: new Date(),
        updateBy: reqAccountId,
      },
    );

    return await this.getAccount(account.id);
  }

  async deleteAccount(
    account: AccountEntity,
    reqAccountId: number,
  ): Promise<boolean> {
    await this.accountRepository.update(
      {
        id: account.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return true;
  }

  async getAccounts(
    filter: Partial<AccountEntity>,
    page: number = 1,
    limit: number = 5,
  ): Promise<{ data: AccountEntity[]; total: number }> {
    const query = this.accountRepository
      .createQueryBuilder('account')
      .where('account.deletedAt IS NULL');

    if (filter.id) {
      query.andWhere('account.id::text LIKE :id', { id: `%${filter.id}%` });
    } //TODO
    if (filter.username) {
      query.andWhere('account.username LIKE :username', {
        username: `%${filter.q}%`,
      });
    }
    if (filter.phoneNumber) {
      query.andWhere('account.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${filter.q}%`,
      });
    }
    if (filter.email) {
      query.andWhere('account.email LIKE :email', {
        email: `%${filter.q}%`,
      });
    }
    if (filter.roleId) {
      query.andWhere('account.roleId::text LIKE :roleId', {
        roleId: `%${filter.roleId}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}
