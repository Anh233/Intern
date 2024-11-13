import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, IsNull } from 'typeorm';
import { AccountDetailEntity } from './entities/account-detail.entity';
import { AccountDetailModel } from './models/account-detail.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { PageListModel } from 'src/utils/models/page-list.model';
import { Role } from 'src/enums/role.enum';
import { AccountModel } from 'src/utils/models/account.model';

@Injectable()
export class AccountDetailService {
  constructor(
    @InjectRepository(AccountDetailEntity)
    private readonly accountDetailRepository: Repository<AccountDetailEntity>,
  ) {}

  async checkPermission(
    accountId: number,
    role: Role,
  ): Promise<AccountDetailEntity> {
    const accountDetail = await this.getAccountDetail(accountId);
    if (
      role !== Role.Admin &&
      role !== Role.CustomerService &&
      accountDetail.accountId !== accountId
    ) {
      throw new HttpException(
        'You do not have permission to access this chat session.',
        HttpStatus.FORBIDDEN,
      );
    }

    return accountDetail;
  }

  async getAccountDetails(
    accountId: number | undefined,
    gender: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ): Promise<PageListModel<AccountDetailModel>> {
    const query =
      this.accountDetailRepository.createQueryBuilder('accountDetail');

    if (accountId) {
      query.andWhere('accountDetail.accountId = :accountId', { accountId });
    }
    if (gender) {
      query.andWhere('accountDetail.gender = :gender', { gender });
    }
    if (q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('accountDetail.firstName LIKE :q', { q: `%${q}%` })
            .orWhere('accountDetail.lastName LIKE :q', { q: `%${q}%` })
            .orWhere('accountDetail.address LIKE :q', { q: `%${q}%` });
        }),
      );
    }

    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const details = data.map((detail) => detail.toModel());

    return new PageListModel<AccountDetailModel>(total, details);
  }

  async getAccountDetail(accountId: number): Promise<AccountDetailEntity> {
    const accountDetail = await this.accountDetailRepository.findOne({
      where: {
        accountId,
        deletedAt: IsNull(),
      },
    });

    if (!accountDetail) {
      throw new HttpException('ACCOUNT_DETAIL_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return accountDetail;
  }

  async updateAccountDetail(
    account: AccountModel,
    firstName: string | undefined,
    lastName: string | undefined,
    gender: number | undefined,
    dateOfBirth: string | undefined,
    address: string | undefined,
    reqAccountId: number,
  ): Promise<AccountDetailEntity> {
    await this.accountDetailRepository.update(
      {
        accountId: account.id,
        deletedAt: IsNull(),
      },
      {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        address: address,
        updateAt: new Date(),
        updateBy: reqAccountId,
      },
    );

    return await this.getAccountDetail(account.id);
  }

  async deleteAccountDetail(
    accountDetail: AccountDetailEntity,
    reqAccountId: number,
  ): Promise<boolean> {
    await this.accountDetailRepository.update(
      {
        accountId: accountDetail.accountId,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );
    return true;
  }

  async addAccountDetail(
    account: AccountModel,
    firstName: string,
    lastName: string,
    gender: number,
    dateOfBirth: string,
    address: string,
    reqAccountId: number,
  ): Promise<AccountDetailEntity> {
    const newAccountDetail = new AccountDetailEntity();
    newAccountDetail.accountId = account.id;
    newAccountDetail.firstName = firstName;
    newAccountDetail.lastName = lastName;
    newAccountDetail.gender = gender;
    newAccountDetail.address = address;
    newAccountDetail.dateOfBirth = dateOfBirth;
    newAccountDetail.createdAt = new Date();
    newAccountDetail.createdBy = reqAccountId;

    return await this.accountDetailRepository.save(newAccountDetail);
  }
}
