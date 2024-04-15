import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoleTypeEnum } from 'src/common/enum';
import { Film } from 'src/films/schemas/film.schemas';
import { Room } from 'src/rooms/schemas/room.schemas';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Room.name })
  roomId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Film.name })
  filmId: mongoose.Schema.Types.ObjectId;


  @Prop({ type: mongoose.Schema.Types.Array })
  history: {
    status: string,
    updateAt: Date,
    updateBy: {
      _id: mongoose.Schema.Types.ObjectId,
      email: string,
    }[];
  }

  @Prop({ type: Object })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
  }


  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
  }

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deleteAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);