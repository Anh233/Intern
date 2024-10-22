import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ChatSessionsDto {
  @Type(() => Number)
  @IsNumber()
  chatSessionId!: number;

  @Type(() => Number)
  @IsNumber()
  accountId!: number;

  @IsString()
  status!: string;

  @IsString()
  category!: string;

  @Type(() => Number)
  @IsNumber()
  isResolved!: number;

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class CreateChatSessionsBodyDto extends PickType(ChatSessionsDto, [
  'accountId',
]) {}

export class UpdateChatSessionsBodyDto extends PickType(ChatSessionsDto, [
  'chatSessionId',
  'status',
  'category',
]) {}

export class AcceptChatSessionBodyDto extends PickType(ChatSessionsDto, [
  'chatSessionId',
  'status',
  'category',
]) {}