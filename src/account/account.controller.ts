import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateAccountBodyDto } from './dtos/account.dto';
import { UpdateAccountBodyDto } from './dtos/account.dto';
import { AccountEntity } from './entities/account.entity';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('all')
  async getAccounts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('roleId') roleId?: number,
  ): Promise<{ data: AccountEntity[]; total: number }> {
    const filter: Partial<AccountEntity> = {
      username, //TO DO:
      email,
      phoneNumber,
      roleId,
    };

    return await this.accountService.getAccounts(
      accountIds,
      roleId,
      q,
      pagination,
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

  @Delete('delete/me')
  async deleteAccount(@Req() request: RequestModel) {
    const accountId = request.user.accountId;
    const account = await this.accountService.getAccount(accountId);
    return await this.accountService.deleteAccount(account, accountId);
  }
}
