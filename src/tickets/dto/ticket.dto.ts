import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateTicketDto {

  @IsNotEmpty()
  status: string;

  @IsMongoId()
  @IsNotEmpty()
  roomId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  filmId: mongoose.Schema.Types.ObjectId;
}

export class UpdateTicketDto {
  @IsNotEmpty({ message: 'id không được để trống', })
  _id: string;
}

export class CreateUserTicketDto {

  @IsNotEmpty()
  @IsMongoId()
  roomId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  filmId: mongoose.Schema.Types.ObjectId;
}
