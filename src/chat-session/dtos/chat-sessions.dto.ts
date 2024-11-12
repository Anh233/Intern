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
  category!: number;

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

export class UpdateChatSessionsBodyDto extends PickType(ChatSessionDto, [
  'chatSessionId',
  'assignedId',
  'categoryName',
]) {}

export class AcceptChatSessionBodyDto extends PickType(ChatSessionDto, [
  'chatSessionId',
  'category',
  'assignedId',
]) {}

export class GetChatSessionIdParamDto extends PickType(ChatSessionDto, [
  'chatSessionId',
<<<<<<< HEAD:src/chat-session/dtos/chat-sessions.dto.ts
  'assignedId',
=======
>>>>>>> feat/func:src/chat-sessions/dtos/chat-sessions.dto.ts
]) {}

export class GetChatSessionsQueryDto extends PartialType(
  PickType(ChatSessionDto, [
    'chatSessionId',
    'accountId',
    'q',
    'limit',
    'page',
  ]),
) {
  @Type(() => Number)
  chatSessionId!: number;
}
