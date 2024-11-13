export class CategoryModel {
  categoryId: number;
  name: string;
  constructor(categoryId: number, name: string) {
    this.categoryId = categoryId;
    this.name = name;
  }
}
