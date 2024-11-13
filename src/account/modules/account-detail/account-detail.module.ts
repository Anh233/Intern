import { forwardRef, Module } from '@nestjs/common';
import { AccountDetailController } from './account-detail.controller';
import { AccountDetailService } from './account-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDetailEntity } from './entities/account-detail.entity';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountDetailEntity]),
    forwardRef(() => AccountModule),
  ],
  controllers: [AccountDetailController],
  providers: [AccountDetailService],
  exports: [AccountDetailService],
})
export class AccountDetailModule {}
