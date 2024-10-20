import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, GetPostQueryDto } from './dtos/post.dto';
import { RequestModel } from 'src/auth/models/request.model';
import { PostModel } from './models/post.model';
import { PaginationModel } from 'src/utils/models/pagination.model';

@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestModel,
  ) {
    const accountId = req.user.accountId;
    const role = req.user.roleId;

    return this.postService.createPost(
      createPostDto.title,
      createPostDto.content,
      accountId,
      role,
    );
  }

  @Get('all')
  async getPostsByAccountIdOrUsername(
    @Query() query: GetPostQueryDto,
  ): Promise<{ data: PostModel[]; total: number }> {
    return await this.postService.getPosts(
      query.accountId,
      query.postId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }
}
