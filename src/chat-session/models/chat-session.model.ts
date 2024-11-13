export class ChatSessionModel {
  chatSessionId: number;
  userAccountId: number;
  assignedAccountId: number;
  status: string;
  categoryId: number;

  constructor(
    id: number,
    userAccountId: number,
    assignedAccountId: number,
    status: string,
    categoryId: number,
  ) {
    this.chatSessionId = id;
    this.userAccountId = userAccountId;
    this.assignedAccountId = assignedAccountId;
    this.status = status;
    this.categoryId = categoryId;
  }
}
