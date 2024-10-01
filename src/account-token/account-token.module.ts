import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTokenEntity } from './entities/account-token.entity';
import { AccountTokenService } from './account-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTokenEntity])],
  providers: [AccountTokenService],
  exports: [AccountTokenService],
})
export class AccountTokenModule {}
