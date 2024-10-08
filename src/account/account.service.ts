import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like } from 'typeorm';
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

    await this.accountRepository.save(newAccount);

    return newAccount;
  }

  async updateAccount(
    username: string,
    password?: string,
    email?: string,
    phoneNumber?: string,
    roleId?: number,
  ): Promise<AccountEntity> {
    const account = await this.getAccountByUsername(username);

    if (!account) {
      throw new HttpException('ACCOUNT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (password !== undefined && password !== null) {
      account.password = await hash(password, 10);
    }
    if (email !== undefined && email !== null) {
      account.email = email;
    }
    if (phoneNumber !== undefined && phoneNumber !== null) {
      account.phoneNumber = phoneNumber;
    }
    if (roleId !== undefined && roleId !== null) {
      account.roleId = roleId;
    }

    return await this.accountRepository.save(account);
  }

  async deleteAccount(username: string): Promise<AccountEntity> {
    const account = await this.getAccountByUsername(username);

    if (!account) {
      throw new HttpException('ACCOUNT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    account.deletedAt = new Date();

    return await this.accountRepository.save(account);
  }

  async getAccounts(
    filter: Partial<AccountEntity>,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: AccountEntity[]; total: number }> {
    const query = this.accountRepository
      .createQueryBuilder('account')
      .where('account.deletedAt IS NULL');

    if (filter.id) {
      query.andWhere('account.id = :id', { id: filter.id });
    }
    if (filter.username) {
      query.andWhere('account.username LIKE :username', {
        username: `%${filter.username}%`,
      });
    }
    if (filter.phoneNumber) {
      query.andWhere('account.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${filter.phoneNumber}%`,
      });
    }
    if (filter.email) {
      query.andWhere('account.email LIKE :email', {
        email: `%${filter.email}%`,
      });
    }
    if (filter.roleId) {
      query.andWhere('account.roleId = :roleId', { roleId: filter.roleId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}
