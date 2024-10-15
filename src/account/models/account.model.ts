export class AccountModel {
  id: number;
  username: string;
  email?: string;
  phoneNumber: string;
  roleId: number;

  constructor(
    id: number,
    username: string,
    email: string,
    phoneNumber: string,
    roleId: number,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.roleId = roleId;
  }
}
