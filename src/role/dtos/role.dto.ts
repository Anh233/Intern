import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RoleDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;

  @Type(() => String)
  @IsString()
  name!: string;

  @Type(() => String)
  @IsString()
  detail!: string;
}

export class CreateRoleDto extends PickType(RoleDto, ['name', 'detail']) {}
export class UpdateRoleDto extends PickType(RoleDto, ['name', 'detail']) {}
