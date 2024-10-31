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
  UpdateAccountDetailBodyDto,
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
    @Param('accountId') accountId: number, //TO DO
  ): Promise<AccountDetailEntity> {
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

  @Put(':accountId/detail/update')
  async updateAccountDetail(
    @Req() req: RequestModel,
    @Param('accountId') accountId: number, //TO DO
    @Body() body: UpdateAccountDetailBodyDto,
  ) {
    const reqAccountId = req.user.accountId;
    const account = await this.accountService.getAccount(accountId);
    return await this.accountDetailService.updateAccountDetail(
      account,
      body.firstName,
      body.lastName,
      body.gender,
      body.dateOfBirth,
      body.address,
      reqAccountId,
    );
  }

  @Post(':accountId/detail')
  async addAccountDetail(
    @Req() req: RequestModel,
    @Param('accountId') accountId: number, //TO DO
    @Body() body: AddAccountDetailBodyDto,
  ) {
    const account = await this.accountService.getAccount(accountId);
    const reqAccountId = req.user.accountId;

    return await this.accountDetailService.addAccountDetail(
      account,
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
    @Param('accountId') accountId: number, //TO DO
  ) {
    const reqAccountId = request.user.accountId;
    const accountDetail =
      await this.accountDetailService.getAccountDetail(accountId);
    return await this.accountDetailService.deleteAccountDetail(
      accountDetail,
      reqAccountId,
    );
  }
}
