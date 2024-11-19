import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBase64, IsNumber, IsOptional, IsString } from 'class-validator';

export class MessagesDto {
  @Type(() => Number)
  @IsNumber()
  messageId!: number;

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

  @IsOptional()
  imageUrl?: string;
}

export class sendMessageBodyDto extends IntersectionType(
  PickType(MessagesDto, ['chatSessionId', 'accountId', 'message']),
  PartialType(PickType(MessagesDto, ['imageUrl'])),
) {}

export class GetMessagesQueryDto extends PartialType(
  PickType(MessagesDto, ['q', 'limit', 'page']),
) {}

export class GetMessagesParamsDto extends PickType(MessagesDto, [
  'chatSessionId',
]) {}

export class GetAccountIdParamsDto extends PickType(MessagesDto, [
  'accountId',
]) {}

export class GetSendMessagesParamsDto extends PickType(MessagesDto, [
  'chatSessionId',
]) {}
