import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { hash } from 'bcrypt';
import { SearchAccountDto } from './dtos/account.dto';
import { AccountModel } from './models/account.model';

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
    filter: SearchAccountDto,
  ): Promise<{ data: AccountModel[]; total: number }> {
    const query = this.accountRepository.createQueryBuilder('account');

    if (filter.accountId) {
      query.andWhere('account.id = :accountId', {
        accountId: filter.accountId,
      });
    }
    if (filter.roleId !== undefined) {
      query.andWhere('account.roleId = :roleId', { roleId: filter.roleId });
    }
    if (filter.q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('account.username LIKE :q', { q: `%${filter.q}%` })
            .orWhere('account.email LIKE :q', { q: `%${filter.q}%` })
            .orWhere('account.phoneNumber LIKE :q', { q: `%${filter.q}%` });
        }),
      );
    }

    const page = filter.page || 1;
    const pageSize = filter.pageSize || 10;
    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const accountModels = data.map(
      (account) =>
        new AccountModel(
          account.id,
          account.username,
          account.email || '',
          account.phoneNumber || '',
          account.roleId,
        ),
    );

    return { data: accountModels, total };
  }
}
