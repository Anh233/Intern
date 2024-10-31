import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AccountDetailDto {
  @Type(() => Number)
  @IsNumber()
  accountDetailId!: number;

  @Type(() => Number)
  @IsNumber()
  accountId: number | undefined;

  @MinLength(3)
  @MaxLength(30)
  @IsString()
  firstName!: string;

  @MinLength(3)
  @MaxLength(30)
  @IsString()
  lastName!: string;

  @Type(() => Number)
  @IsNumber()
  gender!: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  address!: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth!: string;

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class AddAccountDetailBodyDto extends PickType(AccountDetailDto, [
  'accountId',
  'firstName',
  'lastName',
  'gender',
  'address',
  'dateOfBirth',
]) {}

export class UpdateAccountDetailBodyDto extends PartialType(
  PickType(AccountDetailDto, [
    'accountId',
    'firstName',
    'lastName',
    'gender',
    'address',
    'dateOfBirth',
  ]),
) {}

export class GetAccountDetailsQueryDto extends PartialType(
  PickType(AccountDetailDto, ['q', 'accountId', 'page', 'limit', 'gender']),
) {}
