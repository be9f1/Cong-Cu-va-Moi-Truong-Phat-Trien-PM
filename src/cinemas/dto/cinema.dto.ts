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
  name: string;

  address: string;

  description: string;

  // logo: string;
}

export class CinemasPageOptionsDto extends PageOptionsDto {
}

