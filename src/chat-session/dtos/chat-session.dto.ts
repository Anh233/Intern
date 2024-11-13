import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ChatSessionDto {
  @Type(() => Number)
  @IsNumber()
  chatSessionId!: number;

  @Type(() => Number)
  @IsNumber()
  customerId!: number;

  @Type(() => Number)
  @IsNumber()
  accountId!: number;

  @Type(() => Number)
  @IsNumber()
  assignedId!: number;

  @IsString()
  status!: string;

  @IsNumber()
  categoryId!: number;

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

  @IsString()
  categoryName!: string;
}

export class CreateChatSessionsBodyDto extends PickType(ChatSessionDto, [
  'accountId',
]) {}

export class UpdateChatSessionBodyDto extends PickType(ChatSessionDto, [
  'chatSessionId',
  'categoryName',
  'assignedId',
]) {}

export class AcceptChatSessionBodyDto extends PickType(ChatSessionDto, [
  'chatSessionId',
  'assignedId',
]) {}

export class GetChatSessionIdParamDto extends PickType(ChatSessionDto, [
  'chatSessionId',
]) {}

export class getChatSessions extends PartialType(
  PickType(ChatSessionDto, [
    'chatSessionId',
    'accountId',
    'q',
    'limit',
    'page',
  ]),
) {}
