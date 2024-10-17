import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class PostDto {
  @Type(() => Number)
  @IsNumber()
  postId!: number;

  @IsNumber()
  @Type(() => Number)
  accountId!: number;

  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  @MinLength(1)
  @MaxLength(255)
  @IsString()
  title!: string;

  @MinLength(1)
  @IsString()
  content!: string;
}

export class CreatePostDto extends PickType(PostDto, ['title', 'content']) {}
