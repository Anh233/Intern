import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccountTokenEntity } from "./entities/account_token.entity";

@Injectable()
export class AccountTokenService{
    constructor(
        @InjectRepository(AccountTokenEntity)
        private readonly AccountTokenRepository: Repository<AccountTokenEntity>,
    ){}

    async getAccountToken(accounttokenId: number){
        const account_token = await this.AccountTokenRepository.findOne({
            where: {
                id: accounttokenId,
            },
        });
    return account_token;
    }
}