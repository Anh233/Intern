export class AccountDetailModel {
  accountId: number;
  firstName: string;
  lastName: string;
  gender: number;
  dateOfBirth: string;
  address: string;
  constructor(
    accountId: number,
    firstName: string,
    lastName: string,
    gender: number,
    dateOfBirth: string,
    address: string,
  ) {
    this.accountId = accountId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
  }
}
