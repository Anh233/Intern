import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AccountDto {
  @Type(() => Number)
  @IsNumber()
  accountId!: number;

  @MinLength(3)
  @MaxLength(30)
  @IsString()
  username!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  password!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  email!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  phoneNumber!: string;

  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class CreateAccountBodyDto extends PickType(AccountDto, [
  'username',
  'password',
  'email',
  'phoneNumber',
  'roleId',
]) {}

export class UpdateAccountBodyDto extends PickType(AccountDto, [
  'username',
  'password',
  'email',
  'phoneNumber',
  'roleId',
]) {}

export class Article {
  accountId: number | undefined;
  isPublished: boolean | undefined;
  roleId: number | undefined;
}

export class GetAccountsQueryDto extends PartialType(
  PickType(AccountDto, ['q', 'roleId', 'page', 'limit', 'accountId']),
) {}

// export class DeleteAccountDto extends PickType(AccountDto, ['accountId']) {}
