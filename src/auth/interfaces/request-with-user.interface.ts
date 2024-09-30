import { Request } from 'express';
import { AccountEntity } from 'src/account/entities/account.entity';

export interface RequestWithUser extends Request {
  user: AccountEntity;
}
