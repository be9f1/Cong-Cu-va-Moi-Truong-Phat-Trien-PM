import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";
import { Order } from "src/common/enum";
import { PageOptionsDto } from "src/rest-api/page.dto";
class Room {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
  
}

class Film {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  time: number;
}

class Seat {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  price: number;
}

export class CreateShowtimeDto {
  @IsNotEmpty()
  dateStart: string;

  @IsNotEmpty()
  room: Room;

  @IsNotEmpty()
  film: Film;
}

export class UpdateShowtimeDto {
  @IsNotEmpty()
  seats: Seat[];
}

export class UpdateSteatsDto {
  @IsNotEmpty({ message: 'id không được để trống', })
  _id: string;
}

export class ShowtimeOptionsDto extends PageOptionsDto {
  readonly startDate?: string;

  readonly endDate?: string;
  
  @IsEnum(Order)
  @IsOptional()
  readonly orderDate?: Order = Order.DESC;

  readonly available?: string;

  readonly roomId?: mongoose.Schema.Types.ObjectId;

  // readonly filmId?: mongoose.Schema.Types.ObjectId;
}