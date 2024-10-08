import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateAccountBodyDto } from './dtos/account.dto';
import { UpdateAccountBodyDto } from './dtos/account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('all')
  async getAccounts() {
    return await this.accountService.getAccount(1);
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
