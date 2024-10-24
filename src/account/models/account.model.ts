export class AccountModel {
  id: number;
  username: string;
  email: string | undefined;
  phoneNumber: string | undefined;
  roleId: number;

  constructor(
    id: number,
    username: string,
    email: string | undefined,
    phoneNumber: string | undefined,
    roleId: number,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.roleId = roleId;
  }
}
