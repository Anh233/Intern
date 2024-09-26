import { Controller, Get } from "@nestjs/common";
import { AccountTokenService } from "./account_token.service";

@Controller('api/v1/accounttoken')
export class AccountTokenController{
    constructor(private readonly accountTokenService: AccountTokenService){}
    @Get()
    async getAccountTokens(){
        return await this.accountTokenService.getAccountToken(1);
    }
}