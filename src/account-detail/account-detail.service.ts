import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, IsNull } from 'typeorm';
import { AccountDetailEntity } from './entities/account-detail.entity';
import { AccountDetailModel } from './models/account-detail.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { PageListModel } from 'src/utils/models/page-list.model';
import { Role } from 'src/account/enums/role.enum';

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

    const details = data.map(
      (detail) =>
        new AccountDetailModel(
          detail.accountId,
          detail.firstName,
          detail.lastName,
          detail.gender as number,
          detail.dateOfBirth,
          detail.address,
        ),
    );

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
    accountId: number,
    firstName?: string,
    lastName?: string,
    gender?: number,
    dateOfBirth?: string,
    address?: string,
  ): Promise<AccountDetailEntity> {
    await this.accountDetailRepository.update(
      {
        accountId,
        deletedAt: IsNull(),
      },
      {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        address,
        updateBy: accountId,
      },
    );
    return await this.getAccountDetail(accountId);
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
    accountId: number,
    firstName: string,
    lastName: string,
    gender: number,
    dateOfBirth: string,
    address: string,
  ): Promise<AccountDetailEntity> {
    const newAccountDetail = new AccountDetailEntity();
    newAccountDetail.accountId = accountId;
    newAccountDetail.firstName = firstName;
    newAccountDetail.lastName = lastName;
    newAccountDetail.gender = gender;
    newAccountDetail.address = address;
    newAccountDetail.dateOfBirth = dateOfBirth;
    newAccountDetail.createdAt = new Date();
    newAccountDetail.createdBy = accountId;

    return await this.accountDetailRepository.save(newAccountDetail);
  }
}
