import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginBodyDto {
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  username!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  password!: string;
}
