import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountTokenEntity } from "./entities/account_token.entity";
import { AccountTokenController } from "./account_token.contronller";
import { AccountTokenService } from "./account_token.service";

@Module({
    imports: [TypeOrmModule.forFeature([AccountTokenEntity])],
    controllers: [AccountTokenController],
    providers: [AccountTokenService],
})
export class AccountTokenModule {}