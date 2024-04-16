import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import { RoleTypeEnum } from 'src/common/enum';
import { PageOptionsDto } from 'src/rest-api/page.dto';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng', })
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống', })
    password: string;

    @IsNotEmpty({ message: 'gender không được để trống', })
    gender: string;

    @IsNotEmpty({ message: 'address không được để trống', })
    address: string;

    @IsNotEmpty({ message: 'age không được để trống', })
    age: string;

    @IsNotEmpty({ message: 'role không được để trống', })
    @IsMongoId()
    role: string;
   
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống', })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng', })
  @IsNotEmpty({ message: 'Email không được để trống', })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống', })
  password: string;

  @IsNotEmpty({ message: 'gender không được để trống', })
  gender: string;

  @IsNotEmpty({ message: 'address không được để trống', })
  address: string;

  @IsNotEmpty({ message: 'age không được để trống', })
  age: string;

  @IsNotEmpty({ message: 'role không được để trống', })
  @IsMongoId()
  role: string;
}

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
  @IsNotEmpty({ message: 'id không được để trống', })
  _id: string;
}

export class UsersPageOptionsDto extends PageOptionsDto {
  role: RoleTypeEnum;
}

