export class TokenPayloadModel {
  public readonly accountId: number;
  public readonly username: string;
  public readonly tokenKey: string;
  public readonly roleId: number;

  constructor(
    accountId: number,
    username: string,
    tokenKey: string,
    roleId: number,
  ) {
    this.accountId = accountId;
    this.username = username;
    this.tokenKey = tokenKey;
    this.roleId = roleId;
  }

  toJson() {
    return {
      accountId: this.accountId,
      username: this.username,
      tokenKey: this.tokenKey,
      roleId: this.roleId,
    };
  }
}
