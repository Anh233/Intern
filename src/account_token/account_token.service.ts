import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTokenEntity } from './entities/account_token.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class AccountTokenService {
  constructor(
    @InjectRepository(AccountTokenEntity)
    private readonly accountTokenRepository: Repository<AccountTokenEntity>,
  ) {}

  async getAccountToken(accounttokenId: number) {
    const account_token = await this.accountTokenRepository.findOne({
      where: { id: accounttokenId },
    });
    return account_token;
  }

  // Phương thức để lưu token mới vào bảng account_token
  async saveToken(
    account: AccountEntity, // Instance của AccountEntity
    tokenKey: string, // JWT Token
    createdby: number, // Ai đã tạo token
  ): Promise<AccountTokenEntity> {
    // Tìm bản ghi hiện có của người dùng
    let accountToken = await this.accountTokenRepository.findOne({
      where: { account: { id: account.id } },
    });

    if (accountToken) {
      // Nếu bản ghi đã tồn tại, cập nhật token và các thông tin khác
      accountToken.tokenkey = tokenKey;
      accountToken.isactive = 1;
      accountToken.updatedby = createdby;
      accountToken.updatedat = new Date();
    } else {
      // Nếu bản ghi chưa tồn tại, tạo bản ghi mới
      accountToken = this.accountTokenRepository.create({
        account, // Truyền instance của AccountEntity
        tokenkey: tokenKey, // Sử dụng đúng tên thuộc tính
        isactive: 1, // Sử dụng đúng tên thuộc tính
        createdby: createdby, // Sử dụng đúng tên thuộc tính
        createdat: new Date(), // Sử dụng đúng tên thuộc tính
      });
    }

    return await this.accountTokenRepository.save(accountToken);
  }
}
