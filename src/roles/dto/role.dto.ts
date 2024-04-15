import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsMongoId()
  @IsArray()
  @IsNotEmpty()
  permissions: mongoose.Schema.Types.ObjectId[];
}

export class UpdateRoleDto extends CreateRoleDto { }