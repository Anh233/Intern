export class ChatSessionModel {
  id: number;
  userAccountId: number;
  assignedId: number;
  status: string;
  categoryId: number;
  constructor(
    id: number,
    userAccountId: number,
    assignedId: number,
    status: string,
    categoryId: number,
  ) {
    this.id = id;
    this.userAccountId = userAccountId;
    this.assignedId = assignedId;
    this.status = status;
    this.categoryId = categoryId;
  }
}
