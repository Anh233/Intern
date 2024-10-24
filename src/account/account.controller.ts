import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateAccountBodyDto, GetAccountsQueryDto } from './dtos/account.dto';
import { UpdateAccountBodyDto } from './dtos/account.dto';
import { AccountModel } from './models/account.model';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { PaginationModel } from 'src/utils/models/pagination.model';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('all')
  @Roles(Role.Admin)
  async getAccounts(
    @Query() query: GetAccountsQueryDto,
  ): Promise<{ data: AccountModel[]; total: number }> {
    return await this.accountService.getAccounts(
      query.accountId,
      query.roleId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Public()
  @Post('create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.email,
      body.phoneNumber,
      body.roleId,
    );
  }

  @Put('update/me')
  @Roles(Role.Admin, Role.User)
  async updateAccount(
    @Req() request: RequestModel,
    @Body() body: UpdateAccountBodyDto,
  ) {
    const accountId = request.user.accountId;
    const account = await this.accountService.getAccount(accountId);
    return await this.accountService.updateAccount(
      account,
      body.password,
      body.email,
      body.phoneNumber,
      body.roleId,
      accountId,
    );
  }

  @Delete(':accountId/delete')
  @Roles(Role.Admin, Role.User)
  async deleteAccount(
    @Req() request: RequestModel,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    const reqAccountId = request.user.accountId;
    const userRole = request.user.roleId;

    if (userRole == Role.Admin) {
      if (reqAccountId == accountId) {
        throw new ForbiddenException('Admin cannot delete their own account');
      }
    } else if (userRole == Role.User) {
      if (reqAccountId !== accountId) {
        throw new ForbiddenException('User can only delete their own account');
      }
    } else {
      throw new ForbiddenException('Insufficient permissions');
    }

    const account = await this.accountService.getAccount(accountId);
    return await this.accountService.deleteAccount(account, reqAccountId);
  }

  @Get('admin-dashboard')
  @Roles(Role.Admin)
  getAdminDashboard() {
    return 'This is admin dashboard';
  }

  @Get('user')
  @Roles(Role.User)
  getUserData() {
    return 'This is user data';
  }
}
