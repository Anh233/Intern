import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RoleDto {
  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  @Type(() => String)
  @IsString()
  name: string | undefined;

  @Type(() => String)
  @IsString()
  detail: string | undefined;

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;
}

export class CreateRoleDto extends IntersectionType(
  PickType(RoleDto, ['name']),
  PartialType(PickType(RoleDto, ['detail'])),
) {}

export class UpdateRoleDto extends PartialType(
  PickType(RoleDto, ['name', 'detail']),
) {}

export class GetRolesQueryDto extends PartialType(
  PickType(RoleDto, ['q', 'roleId', 'page', 'limit']),
) {}

export class GetRoleIdParamDto extends PickType(RoleDto, ['roleId']) {}
