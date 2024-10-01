import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginBodyDto {
  @MinLength(6)
  @MaxLength(30)
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password!: string;
}
