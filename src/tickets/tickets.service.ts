import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto, CreateUserTicketDto } from './dto/ticket.dto';
import { IUser } from 'src/users/users.interface';
import { Ticket, TicketDocument } from './schemas/ticket.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: SoftDeleteModel<TicketDocument>,
  ) { }

  async create(createUserTicketDto: CreateUserTicketDto, user: IUser) {
    const {
      roomId,
      filmId,
    } = createUserTicketDto;
    const { _id, email } = user;
    let newTicket = await this.ticketModel.create({
      roomId,
      filmId,
      userId: _id,
      email: email,
      status: 'PENDING',
      createdBy: {
        _id,
        email,
      },
      history: [{
        status: 'PENDING',
        updateAt: new Date(),
        updateBy: {
          _id: user._id,
          email: user.email,
        }
      }]

    });
    console.log("🚀 ~ file: tickets.service.ts:42 ~ TicketsService ~ create ~ newTicket:", newTicket)
    return {

      _id: newTicket?._id,
      createAt: newTicket?.createdAt,
    }

  }

  async update(_id: string, status: String, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return new BadRequestException(`not found ticket with id=${_id}`);
    const updated = await this.ticketModel.updateOne(
      { _id },
      {
        status,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status,
            updateAt: new Date(),
            updateBy: {
              _id: user._id,
              email: user.email,
            }
          }
        }
      }
    )
    return updated;
  }

  // async findAll(pageOptionsDto: TicketsPageOptionsDto) {
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
  //       this.ticketModel.countDocuments(conditions),
  //       this.ticketModel.find(conditions, null, options).sort(sort).select("-password") 
  //     ]);
  //     return new Pagination<Partial<Ticket>>(
  //       items.map((item) => item.toJSON()),
  //       total
  //     );
  // }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.ticketModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.ticketModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
      return new BadRequestException(`not found ticket with id=${id}`);
    return await this.ticketModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    await this.ticketModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      })
    return this.ticketModel.softDelete({ _id: id });
  }

  async findByUser(user: IUser) {
    {
      return await this.ticketModel.find(
        { userId: user._id })
        .sort("-createdAt")
        .populate([{ path: 'roomId', select: { name: 1 } }, { path: 'filmId', select: { name: 1 } }])
        ;
    }
  }
}
