import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  FilterFieldTypeEnum,
  FilterOperatorTypeEnum,
  Order
} from 'src/common/enum';

export class PageOptionsDto {
  @ApiPropertyOptional({
    default: ''
  })
  @IsString()
  @IsOptional()
  readonly orderField?: string = '';

  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  @ApiPropertyOptional()
  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  readonly q?: string;

  // @ApiPropertyOptional()
  // @IsString()
  // @IsOptional()
  // readonly status?: string;

  // filters?: any[];
}

export class FilterInput {
  @ApiPropertyOptional()
  field: string;

  @ApiPropertyOptional()
  operator: FilterOperatorTypeEnum;

  @ApiPropertyOptional()
  type: FilterFieldTypeEnum;

  @ApiPropertyOptional()
  value: string;
}
