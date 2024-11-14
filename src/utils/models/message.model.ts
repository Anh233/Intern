export class MessageModel {
  public readonly id: number;
  public readonly chatSessionId: number;
  public readonly accountId: number;
  public readonly message: string;
  public readonly createdAt: Date;
  public readonly createdBy: number;

  constructor(
    id: number,
    chatSessionId: number,
    accountId: number,
    message: string,
    createdAt: Date,
    createdBy: number,
  ) {
    this.id = id;
    this.chatSessionId = chatSessionId;
    this.accountId = accountId;
    this.message = message;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}
