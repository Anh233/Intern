import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/account/enums/role.enum';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
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
}
