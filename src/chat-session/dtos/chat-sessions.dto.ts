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

export class UpdateChatSessionsBodyDto extends PickType(ChatSessionsDto, [
  'chatSessionId',
  'assignedId',
  'categoryName',
]) {}

export class AcceptChatSessionBodyDto extends PickType(ChatSessionsDto, [
  'chatSessionId',
<<<<<<< HEAD:src/chat-session/dtos/chat-sessions.dto.ts
  'assignedId',
]) {}
