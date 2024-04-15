import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsString, Validate, ValidateNested } from "class-validator";
import mongoose, { mongo } from "mongoose";
import { convertStringToArray } from "src/common/common";

class Cinema {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateFilmDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  actors: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genres: string[];

  @IsNotEmpty()
  description: String;

  @IsNotEmpty()
  time: String;

  @IsNotEmpty()
  logo: String;

  // @IsArray()
  // @IsString({ each: true })
  // @IsNotEmpty()
  // images: string[];

  @IsNotEmpty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Transform((value) => new Date(value.value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  isActive: boolean;
}

export class UpdateFilmDto extends CreateFilmDto {

}
