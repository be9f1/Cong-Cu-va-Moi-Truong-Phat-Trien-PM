import { RoleTypeEnum } from "src/common/enum";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string
    }[];
}

export interface IGenre {
    id: string;
    name: string;
  }