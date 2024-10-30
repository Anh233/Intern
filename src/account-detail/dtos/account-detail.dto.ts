import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AccountDetailDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;

  @Type(() => Number)
  @IsNumber()
  accountId!: number;

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

  @IsString()
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

export class AddAccountDetailDto extends PickType(AccountDetailDto, [
  'firstName',
  'lastName',
  'gender',
  'address',
  'dateOfBirth',
]) {}

export class UpdateAccountDetailDto extends PickType(AccountDetailDto, [
  'firstName',
  'lastName',
  'gender',
  'address',
  'dateOfBirth',
]) {}

export class DeleteAccountDetailDto extends PickType(AccountDetailDto, [
  'firstName',
  'lastName',
  'gender',
  'address',
  'dateOfBirth',
]) {}

export class GetAccountDetailsQueryDto extends PartialType(
  PickType(AccountDetailDto, ['q', 'accountId', 'page', 'limit', 'gender']),
) {}
