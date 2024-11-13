export class ChatSessionModel {
  public readonly chatSessionId: number;
  public readonly userAccountId: number;
  public readonly assignedAccountId: number;
  public readonly status: string;
  public readonly categoryId: number;

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
