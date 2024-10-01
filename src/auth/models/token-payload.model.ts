export class TokenPayloadModel {
  public readonly accountId: number;
  public readonly tokenKey: string;
  public readonly roleId: number;

  constructor(accountId: number, tokenKey: string, roleId: number) {
    this.accountId = accountId;
    this.tokenKey = tokenKey;
    this.roleId = roleId;
  }
}
