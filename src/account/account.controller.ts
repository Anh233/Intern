import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateAccountBodyDto, SearchAccountDto } from './dtos/account.dto';
import { UpdateAccountBodyDto } from './dtos/account.dto';
import { AccountModel } from './models/account.model';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('all')
  @Roles(Role.Admin)
  async getAccounts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('roleId') roleId?: number,
  ): Promise<{ data: AccountModel[]; total: number }> {
    const filter: SearchAccountDto = {
      q: username || email || phoneNumber,
      roleId,
      page,
      pageSize: limit,
    };

    return await this.accountService.getAccounts(filter);
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

  @Delete('delete/:accountId')
  @Roles(Role.Admin)
  async deleteAccount(
    @Req() request: RequestModel,
    @Param('accountId') accountId: string,
  ) {
    const adminId = request.user.accountId;
    const accountIdNumber = parseInt(accountId, 10);

    if (adminId === accountIdNumber) {
      throw new ForbiddenException('Admin cannot delete their own account');
    }

    const account = await this.accountService.getAccount(accountIdNumber);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return await this.accountService.deleteAccount(account, adminId);
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
