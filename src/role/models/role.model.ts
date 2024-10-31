export class RoleModel {
  public readonly id: number;
  public readonly name: string;
  public readonly detail: string;

  constructor(id: number, name: string, detail: string) {
    this.id = id;
    this.name = name;
    this.detail = detail;
  }
}
