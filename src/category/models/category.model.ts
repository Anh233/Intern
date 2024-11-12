export class CategoryModel {
  categoryId: number;
  name: string;
  constructor(id: number, name: string) {
    this.categoryId = id;
    this.name = name;
  }
}
