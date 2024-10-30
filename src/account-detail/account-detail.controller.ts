import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AccountDetailService } from './account-detail.service';
import { AccountDetailEntity } from './entities/account-detail.entity';
import {
  AddAccountDetailDto,
  GetAccountDetailsQueryDto,
  UpdateAccountDetailDto,
} from './dtos/account-detail.dto';
import { AccountDetailModel } from './models/account-detail.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { Roles } from 'src/account/decorators/roles.decorator';
import { Role } from 'src/account/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';
import { AccountService } from 'src/account/account.service';

@Controller('api/v1/account')
export class AccountDetailController {
  constructor(
    private readonly accountDetailService: AccountDetailService,
    private readonly accountService: AccountService,
  ) {}

  @Get(':accountId/detail')
  async getAccountDetail(
    @Param('accountId') accountId: number,
  ): Promise<AccountDetailEntity> {
    return this.accountDetailService.getAccountDetail(accountId);
  }

  @Roles(Role.Admin)
  @Get('details')
  async getAccountDetails(
    @Query() query: GetAccountDetailsQueryDto,
  ): Promise<{ data: AccountDetailModel[]; total: number }> {
    return await this.accountDetailService.getAccountDetails(
      query.accountId,
      query.gender,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post(':accountId/update-detail')
  async updateAccountDetail(
    @Param('accountId') accountId: number,
    @Body() body: UpdateAccountDetailDto,
  ) {
    await this.getAccountDetail(accountId);
    return await this.accountDetailService.updateAccountDetail(
      accountId,
      body.firstName,
      body.lastName,
      body.gender,
      body.dateOfBirth,
      body.address,
    );
  }

  @Put(':accountId/add-detail')
  async addAccountDetail(
    @Param('accountId') accountId: number,
    @Body() body: AddAccountDetailDto,
  ) {
    await this.accountService.getAccount(accountId);
    return await this.accountDetailService.addAccountDetail(
      accountId,
      body.firstName,
      body.lastName,
      body.gender,
      body.dateOfBirth,
      body.address,
    );
  }

  @Delete(':accountId/delete-detail')
  async deleteAccountDetail(
    @Req() request: RequestModel,
    @Param('accountId') accountId: number,
  ) {
    const reqAccountId = request.user.accountId;
    const account = await this.accountDetailService.getAccountDetail(accountId);
    return await this.accountDetailService.deleteAccountDetail(
      account,
      reqAccountId,
    );
  }
}
