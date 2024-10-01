export class LoginModel {
  public readonly accessToken: string;
  public readonly expiresIn: string;

  constructor(accessToken: string, expiresIn: string) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
  }
}
