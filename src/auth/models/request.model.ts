import { Request } from 'express';
import { TokenPayloadModel } from './token-payload.model';

export class RequestModel extends Request {
  user!: TokenPayloadModel;
}
