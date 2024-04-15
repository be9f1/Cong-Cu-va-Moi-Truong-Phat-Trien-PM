import { Model } from "mongoose";

export abstract class AbstractMongooseModel extends Model {
  toJson() {
    return this.toObject();
  }
}
