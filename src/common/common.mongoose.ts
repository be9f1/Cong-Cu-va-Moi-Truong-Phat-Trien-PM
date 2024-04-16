import { applyDecorators } from '@nestjs/common';
import { Schema, SchemaOptions } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export abstract class AbstractMongooseModel extends Model {
  toJson() {
    const data = this.toObject();
    for (const key in data) {
      if (data[key] instanceof Types.ObjectId) {
        data[key] = String(data[key]);
      }
    }
    return data;
  }
}

export function BaseSchema(options?: SchemaOptions) {
  return applyDecorators(
    Schema({
      id: true,
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      },
      toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
          delete ret._id;
        }
      },
      toObject: {
        virtuals: true,
        transform: function (doc, ret) {
          delete ret._id;
        }
      },
      versionKey: false,
      ...options
    })
  );
}
