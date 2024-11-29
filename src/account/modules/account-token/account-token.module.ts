import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTokenEntity } from './entities/account-token.entity';
import { AccountTokenService } from './account-token.service';
import { AccountTokenController } from './account-token.contronller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTokenEntity])],
  controllers: [AccountTokenController],
  providers: [AccountTokenService],
  exports: [AccountTokenService],
})
export class AccountTokenModule {}
