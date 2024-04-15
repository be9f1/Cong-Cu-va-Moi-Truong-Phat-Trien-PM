import { OmitType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";
import { PageOptionsDto } from "src/rest-api/page.dto";

export class CreateCinemaDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  logo: string;

}

export class UpdateCinemaDto {
@IsNotEmpty({ message: 'id không được để trống', })
_id: string;
}

export class CinemasPageOptionsDto extends PageOptionsDto {
}

