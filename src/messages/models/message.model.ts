export class MessageModel {
  id: number;
  chatSessionId: number;
  accountId: number;
  message: string;

  constructor(
    id: number,
    chatSessionId: number,
    accountId: number,
    message: string,
  ) {
    this.id = id;
    this.chatSessionId = chatSessionId;
    this.accountId = accountId;
    this.message = message;
  }
}
