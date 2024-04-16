import { Inject, Injectable } from '@nestjs/common';
import {  CreateGenreDto } from './dto/genre.dto';
import { Genre, GenreDocument } from './schemas/genre.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name)
    private genreModel: SoftDeleteModel<GenreDocument>,
  ) {}

  create(createGenreDto: CreateGenreDto, user: IUser) {
    return this.genreModel.create({
      ...createGenreDto, 
      createdBy: {
        _id: user._id,
        email: user.email,
      }
      })
  }

  async update(id: string, upadteGenreDto: CreateGenreDto, user: IUser) {

    return await this.genreModel.updateOne(
      { _id: id },
      {
      ...upadteGenreDto, 
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
      })
  }

  // async findAll(pageOptionsDto: GenresPageOptionsDto) {
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
  //       this.genreModel.countDocuments(conditions),
  //       this.genreModel.find(conditions, null, options).sort(sort).select("-password") 
  //     ]);
  //     return new Pagination<Partial<Genre>>(
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

    const totalItems = (await this.genreModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
      
    const result = await this.genreModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as unknown as string )
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

  async findByIds(ids: string[]) {
    return await this.genreModel.find({
      _id: { $in: ids }
    })
  }

  async remove(id: string, user: IUser) {
    await this.genreModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      })
    return this.genreModel.softDelete({ _id: id });
  }
}
