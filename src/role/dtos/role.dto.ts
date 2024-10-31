import { PartialType, PickType } from '@nestjs/swagger';
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

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class CreateRoleDto extends PickType(RoleDto, ['name', 'detail']) {}
export class UpdateRoleDto extends PickType(RoleDto, ['name', 'detail']) {}
export class GetRolesQueryDto extends PartialType(
  PickType(RoleDto, ['q', 'id', 'page', 'limit']),
) {}
