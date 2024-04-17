import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { IGenre } from 'src/users/users.interface';

export type FilmDocument = HydratedDocument<Film>;

@Schema({ timestamps: true })
export class Film {
  @Prop()
  name: string;

  @Prop()
  director: string;

  @Prop()
  actors: string[];

  @Prop()
  genres?: string[];

  @Prop()
  description: String;

  @Prop()
  time: number;

  @Prop()
  logo: String;

  // @Prop()
  // images: String[];

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean;

  @Prop({ type: [Object] })
  cinemas: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
  }[]

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
  }

  @Prop({ type: Object })
  updatedBy: {
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

export const FilmSchema = SchemaFactory.createForClass(Film);