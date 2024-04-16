import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import exp from 'constants';
import mongoose, { HydratedDocument } from 'mongoose';
import { AbstractMongooseModel, BaseSchema } from 'src/common/common.mongoose';

@BaseSchema({
  collection: 'showtimes',
  strict: true
})

@Schema({ timestamps: true })
export class Showtime extends AbstractMongooseModel{
  
  @Prop()
  name: string;

  @Prop({ type: [Object] })
  seats: { _id: string, price: number, status: string }[];

  @Prop({type: Date})
  dateStart: string;

  @Prop({type: Date})
  dateEnd: string;

  @Prop({ type: Object })
  room: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
  }

  @Prop({ type: Object })
  film: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    time: number,
  }

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

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);

ShowtimeSchema.loadClass(Showtime);

export type ShowtimeDocument = Showtime & Document;
