import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountDetailModule } from 'src/account/modules/account-detail/account-detail.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), AccountDetailModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
