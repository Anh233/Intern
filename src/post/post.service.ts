import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Role } from 'src/account/enums/role.enum';
import { AccountEntity } from 'src/account/entities/account.entity';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { PostModel } from './models/post.model';
import { PageListModel } from 'src/utils/models/page-list.model';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async createPost(
    title: string,
    content: string,
    accountId: number,
    role: number,
  ): Promise<PostEntity> {
    if (role !== Role.Admin && role !== Role.User) {
      throw new ForbiddenException(
        'You do not have permission to create a post',
      );
    }

    const newPost = new PostEntity();
    newPost.title = title;
    newPost.content = content;
    newPost.createdAt = new Date();
    newPost.accountId = accountId;
    newPost.roleId = role;
    newPost.createdBy = accountId;

    return this.postRepository.save(newPost);
  }

  async getPostById(postId: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async getPosts(
    accountId: number | undefined,
    postId: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ) {
    const query = this.postRepository.createQueryBuilder('post');
    if (accountId) {
      query.andWhere('post.accountId = :accountId', { accountId: accountId });
    }
    if (postId !== undefined) {
      query.andWhere('post.postId = :postId', { postId: postId });
    }
    if (q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('post.title LIKE :q', { q: `%${q}%` })
            .orWhere('post.content LIKE :q', { q: `%${q}%` })
            .orWhere('post.username LIKE :q', { q: `%${q}%` });
        }),
      );
    }
    const [data, total] = await query
      .skip(pagination.limit * (pagination.page - 1))
      .take(pagination.limit)
      .getManyAndCount();

    const posts = data.map(
      (post) =>
        new PostModel(post.postId, post.title, post.content, post.accountId),
    );
    return new PageListModel<PostModel>(total, posts);
  }
}
