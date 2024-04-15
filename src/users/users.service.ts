import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto, UpdateUserDto, UsersPageOptionsDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User as UserDecorator } from '../decorator/customize';
import { Order, RoleTypeEnum } from 'src/common/enum';
import { Pagination } from 'src/common/pagination';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schemas';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  // async findAll(pageOptionsDto: UsersPageOptionsDto) {
  //   const { 
  //     orderField = 'createdAt',
  //     order = Order.DESC,
  //     page,
  //     limit,
  //     q,
  //     role
  //   } = pageOptionsDto;
  //   let conditions: Record<string, any> = q
  //     ? {
  //       $or: [{ class: Number(q) }, { subject: { $regex: q, $options: 'i' } }]
  //     }
  //     : {};
  //     const options = {
  //       skip: (page - 1) * limit,
  //       limit: limit
  //     };
  //     conditions = { ...conditions };
	// 	if (role) {
	// 		conditions = { ...conditions, role }
	// 	}
  //     const sort = orderField
  //       ? {
  //         [orderField]: order === Order.DESC ? -1 : 1
  //       }
  //       : {
  //         createdAt: -1
  //       };
        
  //     console.log(sort);
  //     const [total, items] = await Promise.all([
  //       this.userModel.countDocuments(conditions),
  //       this.userModel.find(conditions, null, options).sort(sort).select("-password") 
  //     ]);
  //     return new Pagination<Partial<User>>(
  //       items.map((item) => item.toJSON()),
  //       total
  //     );
  // }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection ,population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
      
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort )
      .populate(population)
      .exec();

      return {
        meta: {
          current: currentPage, //trang hiện tại
          pageSize: limit, //số lượng bản ghi đã lấy
          pages: totalPages, //tổng số trang với điều kiện query
          total: totalItems // tổng số phần tử (số bản ghi)
        },
        result //kết quả query
        }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    return this.userModel.findOne({
      _id: id
    }).select("-password")
      .populate({ path: 'role', select: { _id: 1, name: 1 } });
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({
      path: 'role',
      select: { name: 1 }
    });
  }


  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto,
    updateBy: {
      _id: user._id,
      email: user.email,
    } })
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;
    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === "tadrake2003@gmail.com") {
      throw new BadRequestException("Cannot delete admin account");
    }
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return this.userModel.softDelete({
      _id: id
    })
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, gender, address, age } = user;
    const hashPassword = this.getHashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException("Email đã tồn tại");
    }
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    let newRegisterUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id,
    })
    return newRegisterUser;
}   
 async create(createUserDto: CreateUserDto, @UserDecorator() user: IUser) {
   const { name, email, password, age, gender, address, role } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException("Email đã tồn tại");
    }
    let newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return newUser;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, {
        refreshToken
    })
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }, {
        refreshToken
    }).populate({
      path: 'role',
      select: { name: 1 } 
    })
}

}
