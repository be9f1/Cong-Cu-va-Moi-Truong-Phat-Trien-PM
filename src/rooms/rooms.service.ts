import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/room.dto';
import { Room, RoomDocument } from './schemas/room.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: SoftDeleteModel<RoomDocument>,
  ) { }

  async create(createRoomDto: CreateRoomDto, user: IUser) {
    const {
      name,
      type,
      cinema,

    } = createRoomDto;
    let newSeats = [
      ...Array.from({ length: 20 }, (_, i) => ({ _id: `s${i + 1}`, price: 60000, status: 'READY' })),
      ...Array.from({ length: 20 }, (_, i) => ({ _id: `s${i + 21}`, price: 70000, status: 'READY' })),
      ...Array.from({ length: 10 }, (_, i) => ({ _id: `s${i + 41}`, price: 65000, status: 'READY' })),
    ];
    let newRoom = await this.roomModel.create({
      name, type, seats: newSeats, cinema, createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: newRoom?._id,
      createAt: newRoom?.createdAt,
    }
  }

  async update(id: string, upadteRoomDto: CreateRoomDto, user: IUser) {

    return await this.roomModel.updateOne(
      { _id: id },
      {
        ...upadteRoomDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      })
  }

  // async findAll(pageOptionsDto: RoomsPageOptionsDto) {
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
  //       this.roomModel.countDocuments(conditions),
  //       this.roomModel.find(conditions, null, options).sort(sort).select("-password") 
  //     ]);
  //     return new Pagination<Partial<Room>>(
  //       items.map((item) => item.toJSON()),
  //       total
  //     );
  // }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roomModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roomModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as unknown as string)
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
      return new BadRequestException(`not found room with id=${id}`);
    return await this.roomModel.findById(id);
  }

  async findAllByCinemaId(cinemaId: string) {
    return this.roomModel.find({ cinemaId }).exec();
  }

  async remove(id: string, user: IUser) {
    await this.roomModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      })
    return this.roomModel.softDelete({ _id: id });
  }

  async selectSteat(id: string, seats:
    {
      id: string,
      status: string
    }[], user: IUser) {
    return await this.roomModel.updateOne(
      { _id: id },
      {
        ...seats,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      }
    )
  }

  // async selectSteat(id: string, seatIds: string[]
  // , ) :Promise<void>{
  //   const room = await this.roomModel.findById(id);
  //   if(room ){
  //     room.seats.forEach(seat => {
  //       if(seatIds.includes(seat._id)){
  //         seat.status = 'SLECTED';
  //       }
  //     });
  //     await room.save();
  //   }else {
  //     throw new Error('Room not found');
  //   }

    // return await this.roomModel.updateOne(
    //   { _id: id },
    //   {
    //     seats: updatedSeats,
    //     updatedBy: {
    //       _id: user._id,
    //       email: user.email,
    //     }
    //   }
    // );
  // }
}
