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
  AddAccountDetailBodyDto,
  GetAccountDetailsQueryDto,
  GetAccountIdParamDto,
  UpdateAccountDetailBodyDto,
} from './dtos/account-detail.dto';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { Roles } from 'src/account/decorators/roles.decorator';
import { Role } from 'src/account/enums/role.enum';
import { RequestModel } from 'src/auth/models/request.model';
import { AccountService } from 'src/account/account.service';
import { AccountModel } from 'src/account/models/account.model';
import { AccountModel } from 'src/account/models/account.model';

@Controller('api/v1/account')
export class AccountDetailController {
  constructor(
    private readonly accountDetailService: AccountDetailService,
    private readonly accountService: AccountService,
  ) {}

  @Get(':accountId/detail')
  async getAccountDetail(
    @Param() params: GetAccountIdParamDto,
  ): Promise<AccountDetailEntity> {
    const accountId = params.accountId;

    return this.accountDetailService.getAccountDetail(accountId);
  }

  @Roles(Role.Admin)
  @Get('details')
  async getAccountDetails(@Query() query: GetAccountDetailsQueryDto) {
    return await this.accountDetailService.getAccountDetails(
      query.accountId,
      query.gender,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post(':accountId/detail/add')
  async addAccountDetail(
    @Req() req: RequestModel,
    @Param() params: GetAccountIdParamDto,
    @Body() body: AddAccountDetailBodyDto,
  ) {
    const accountId = params.accountId;

    const account = await this.accountService.getAccount(accountId, true);
    const reqAccountId = req.user.accountId;

    return await this.accountDetailService.addAccountDetail(
      account as AccountModel,
      body.firstName,
      body.lastName,
      body.gender,
      body.dateOfBirth,
      body.address,
      reqAccountId,
    );
  }

  @Put(':accountId/detail/update')
  async updateAccountDetail(
    @Req() req: RequestModel,
    @Param() params: GetAccountIdParamDto,
    @Body() body: UpdateAccountDetailBodyDto,
  ) {
    const accountId = params.accountId;
    const reqAccountId = req.user.accountId;

    const account = await this.accountService.getAccount(accountId, true);
    return await this.accountDetailService.updateAccountDetail(
      account as AccountModel,
      body.firstName,
      body.lastName,
      body.gender,
      body.dateOfBirth,
      body.address,
      reqAccountId,
    );
  }

  @Delete(':accountId/detail/delete')
  async deleteAccountDetail(
    @Req() request: RequestModel,
    @Param() params: GetAccountIdParamDto,
  ) {
    const accountId = params.accountId;

    const reqAccountId = request.user.accountId;
    const accountDetail =
      await this.accountDetailService.getAccountDetail(accountId);
    return await this.accountDetailService.deleteAccountDetail(
      accountDetail,
      reqAccountId,
    );
  }
}
