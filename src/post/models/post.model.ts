export class PostModel {
  postId: number;
  title: string;
  content: string | undefined;
  accountId: number;

  constructor(
    postId: number,
    title: string,
    content: string | undefined,
    accountId: number,
  ) {
    this.postId = postId;
    this.title = title;
    this.content = content;
    this.accountId = accountId;
  }
}
