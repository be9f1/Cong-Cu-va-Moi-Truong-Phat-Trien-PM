import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoleTypeEnum } from 'src/common/enum';

export type CinemaDocument = HydratedDocument<Cinema>;

@Schema({ timestamps: true})
export class Cinema {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    description: string;

  @Prop()
  logo: string;

    @Prop({type: Object})
    createdBy: {
      _id: mongoose.Schema.Types.ObjectId,
      email: string,
    }

    @Prop({type: Object})
    updatedBy: {
      _id: mongoose.Schema.Types.ObjectId,
      email: string,
    }

    @Prop({type: Object})
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

export const CinemaSchema = SchemaFactory.createForClass(Cinema);