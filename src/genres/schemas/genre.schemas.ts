import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoleTypeEnum } from 'src/common/enum';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({ timestamps: true})
export class Genre {
    @Prop({ required: true })
    name: string;

    @Prop({type: Object})
    createdBy: {
      _id: mongoose.Schema.Types.ObjectId,
      email: string,
    }

    @Prop({ type: Object })
    film: {
      _id: mongoose.Schema.Types.ObjectId,
      name: string,
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

export const GenreSchema = SchemaFactory.createForClass(Genre);