export class RoleModel {
  id: number;
  name: string;
  detail: string;

  constructor(id: number, name: string, detail: string) {
    this.id = id;
    this.name = name;
    this.detail = detail;
  }
}
