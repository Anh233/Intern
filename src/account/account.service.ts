import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { hash } from 'bcrypt';
import { CreateAccountBodyDto } from './dtos/account.dto';
import { UpdateAccountBodyDto } from './dtos/account.dto';

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

    const newAccount = this.accountRepository.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      roleId,
      isActive: 1,
      createdAt: new Date(),
    });

    await this.accountRepository.save(newAccount);

    return newAccount;
  }

  async updateAccount(
    accountId: number,
    updateData: UpdateAccountBodyDto,
  ): Promise<AccountEntity> {
    const account = await this.getAccount(accountId); //kiểm tra acc đã bị xóa chưa

    if (updateData.username !== null) {
      account.username = updateData.username;
    }
    if (updateData.password !== null && updateData.password !== undefined) {
      account.password = await hash(updateData.password, 10);
    }
    if (updateData.email !== null) {
      account.email = updateData.email;
    }
    if (updateData.phoneNumber !== null) {
      account.phoneNumber = updateData.phoneNumber;
    }

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
