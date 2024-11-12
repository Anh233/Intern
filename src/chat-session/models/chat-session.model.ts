export class ChatSessionModel {
  chatSessionId: number;
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
    this.chatSessionId = id;
    this.userAccountId = userAccountId;
    this.assignedId = assignedId;
    this.status = status;
    this.categoryId = categoryId;
  }
}
