import { Inject, Injectable } from '@nestjs/common';
import { CinemasPageOptionsDto, CreateCinemaDto, UpdateCinemaDto } from './dto/cinema.dto';
import { Cinema, CinemaDocument } from './schemas/cinema.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class CinemasService {
  constructor(
    @InjectModel(Cinema.name)
    private cinemaModel: SoftDeleteModel<CinemaDocument>,
  ) {}

  create(createCinemaDto: CreateCinemaDto, user: IUser) {
    return this.cinemaModel.create({
      ...createCinemaDto, 
      createdBy: {
        _id: user._id,
        email: user.email,
      }
      })
  }

  async update(id: string, upadteCinemaDto: UpdateCinemaDto, user: IUser) {

    return await this.cinemaModel.updateOne(
      { _id: id },
      {
      ...upadteCinemaDto, 
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
      })
  }

  // async findAll(pageOptionsDto: CinemasPageOptionsDto) {
  //   const { 
  //     orderField = 'createdAt',
  //     order = Order.DESC,
  //     page,
  //     limit,
  //     q,
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
  //     const sort = orderField
  //       ? {
  //         [orderField]: order === Order.DESC ? -1 : 1
  //       }
  //       : {
  //         createdAt: -1
  //       };
        
  //     console.log(sort);
  //     const [total, items] = await Promise.all([
  //       this.cinemaModel.countDocuments(conditions),
  //       this.cinemaModel.find(conditions, null, options).sort(sort).select("-password") 
  //     ]);
  //     return new Pagination<Partial<Cinema>>(
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

    const totalItems = (await this.cinemaModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
      
    const result = await this.cinemaModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as unknown as string) // Fix: Cast 'sort' to string
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
      return 'not found cinema';
    return await this.cinemaModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    await this.cinemaModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      })
    return this.cinemaModel.softDelete({ _id: id });
  }
}
