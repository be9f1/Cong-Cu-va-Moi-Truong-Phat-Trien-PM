import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { PageOptionsDto } from "src/rest-api/page.dto";

class Cinema {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  cinema: Cinema;
}

export class UpdateRoomDto {
  @IsNotEmpty({ message: 'id không được để trống', })
  _id: string;
}

export class UpdateSteatsDto {
  @IsNotEmpty({ message: 'id không được để trống', })
  _id: string;
}
