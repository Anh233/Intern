export class TokenPayloadModel {
  constructor(
    public readonly accountId: number,
    public readonly tokenKey: string,
    public readonly roleId: number,
  ) {}

  ChangeObject() {
    return {
      accountId: this.accountId,
      tokenKey: this.tokenKey,
      roleId: this.roleId,
    };
  }
}
