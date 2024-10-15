import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class Account {
  @IsNumber()
  id!: number;

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

  @IsNumber()
  roleId!: number;
}

export class CreateAccountBodyDto extends PickType(Account, [
  'username',
  'password',
  'email',
  'phoneNumber',
  'roleId',
]) {}

export class UpdateAccountBodyDto extends PickType(Account, [
  'username',
  'password',
  'email',
  'phoneNumber',
  'roleId',
]) {}

export class SearchAccountDto {
  accountId?: number;
  roleId?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}
