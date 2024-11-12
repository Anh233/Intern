import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class MessagesDto {
  @Type(() => Number)
  @IsNumber()
  chatSessionId!: number;

  @Type(() => Number)
  @IsNumber()
  accountId!: number;

  @IsString()
  message!: string;

  @IsString()
  q?: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;

  @IsString()
  imageUrl?: string;
}

export class sendMessageDto extends PickType(MessagesDto, [
  'chatSessionId',
  'accountId',
  'message',
  'imageUrl',
]) {}

export class GetMessagesQueryDto extends PartialType(
  PickType(MessagesDto, ['q', 'limit', 'page'] as const),
) {}
