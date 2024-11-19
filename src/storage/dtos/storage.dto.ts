import { PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class StorageDto {
  @Type(() => Number)
  @IsNumber()
  chatSessionId!: number;
}

export class GetUploadImageParamsDto extends PickType(StorageDto, [
  'chatSessionId',
]) {}