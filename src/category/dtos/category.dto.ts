import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CategoryDto {
  @Type(() => Number)
  @IsNumber()
  categoryId!: number;

  @MinLength(3)
  @MaxLength(30)
  @IsString()
  name!: string;

  @IsString()
  q!: string;

  @Type(() => Number)
  @IsNumber()
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  page!: number;

  @Type(() => Number)
  @IsNumber()
  accountId!: number;
}

export class CreateCategoryBodyDto extends PickType(CategoryDto, ['name']) {}

export class UpdateCategoryBodyDto extends PickType(CategoryDto, ['name']) {}

export class GetCategoriesQueryDto extends PartialType(
  PickType(CategoryDto, ['q', 'categoryId', 'page', 'limit']),
) {}

export class GetCategoryIdParamDto extends PickType(CategoryDto, [
  'categoryId',
]) {}

export class GetAccountIdParamDto extends PickType(CategoryDto, [
  'accountId',
]) {}
