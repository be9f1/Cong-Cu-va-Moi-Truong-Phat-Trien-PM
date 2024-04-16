import { OmitType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";

export class CreateGenreDto {
  @IsNotEmpty()
  name: string;
 
}

export class UpdateGenreDto {
@IsNotEmpty({ message: 'id không được để trống', })
_id: string;
}