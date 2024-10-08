export class TokenPayloadModel {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly tokenKey: string,
    public readonly roleId: number,
  ) {}

  ChangeObject() {
    return {
      sub: this.accountId,
      username: this.username,
      tokenKey: this.tokenKey,
      roleId: this.roleId,
    };
  }
}
