import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ChatSessionDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;

  @Type(() => Number)
  @IsNumber()
  userAccountId!: number;

  @Type(() => Number)
  @IsNumber()
  assignedId!: number;

  @Type(() => String)
  status!: string;

  @Type(() => Number)
  categoryId!: number;

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;

  @Type(() => Number)
  @IsNumber()
  accountId!: number;
}
