import { PickType } from '@nestjs/swagger';
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
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class sendMessageDto extends PickType(MessagesDto, [
  'chatSessionId',
  'accountId',
  'message',
]) {}

export class GetMessagesDto extends PickType(MessagesDto, ['chatSessionId']) {}
