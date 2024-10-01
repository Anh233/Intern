import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAccountBodyDto {
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
