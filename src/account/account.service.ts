import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PrimaryColumn, Repository } from "typeorm";
import { AccountEntity } from "./entities/account.entity";

@Injectable()
export class AccountService{
constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
){}

    async getAccount(accountId: number){
        const account = await this.accountRepository.findOne({
            where: {
                id: accountId,
            },
        });
    return account;
    }
}