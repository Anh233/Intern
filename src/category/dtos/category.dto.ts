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

export class CreateCategoryDto extends PickType(CategoryDto, [
  'accountId',
  'name',
]) {}

export class UpdateCategoryBodyDto extends PickType(CategoryDto, [
  'categoryId',
  'name',
]) {}

export class GetCategoriesQueryDto extends PartialType(
  PickType(CategoryDto, ['categoryId', 'page', 'limit', 'q']),
) {}

export class GetCategoryIdParamDto extends PickType(CategoryDto, [
  'categoryId',
]) {}

export class GetAccountIdParamDto extends PickType(CategoryDto, [
  'accountId',
]) {}
