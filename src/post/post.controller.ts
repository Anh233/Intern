import { Body, Controller, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { RequestModel } from 'src/auth/models/request.model';
import { CreatePostDto } from './dtos/post.dto';

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
}
