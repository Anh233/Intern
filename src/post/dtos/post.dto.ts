import { PartialType, PickType } from '@nestjs/swagger';
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

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class CreatePostDto extends PickType(PostDto, ['title', 'content']) {}

export class GetPostQueryDto extends PartialType(
  PickType(PostDto, ['q', 'postId', 'page', 'limit', 'accountId']),
) {}
