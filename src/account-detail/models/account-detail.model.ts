export class AccountDetailModel {
  public readonly accountId: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly gender: number | undefined;
  public readonly dateOfBirth: string;
  public readonly address: string;

  constructor(
    accountId: number,
    firstName: string,
    lastName: string,
    gender: number | undefined,
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
