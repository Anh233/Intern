import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateAccountBodyDto } from './dtos/account.dto';
import { UpdateAccountBodyDto } from './dtos/account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccountEntity } from './entities/account.entity';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @UseGuards(JwtAuthGuard)
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
      username,
      email,
      phoneNumber,
      roleId,
    };
    return await this.accountService.getAccounts(filter, page, limit);
  }

  @Public()
  @Post('/create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.email,
      body.phoneNumber,
      body.roleId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update/me')
  async updateAccount(
    @Req() request: RequestModel,
    @Body() body: UpdateAccountBodyDto,
  ) {
    const username = request.user.username;
    return await this.accountService.updateAccount(
      username,
      body.password,
      body.email,
      body.phoneNumber,
      body.roleId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/me')
  async deleteAccount(@Req() request: any) {
    const username = request.user.username;
    return await this.accountService.deleteAccount(username);
  }
}
