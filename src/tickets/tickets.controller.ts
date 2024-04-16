import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, CreateUserTicketDto } from './dto/ticket.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Post()
  create(@Body() createUserTicketDto: CreateUserTicketDto,
    @User() user: IUser,
  ) {
    return this.ticketsService.create(createUserTicketDto, user);
  }

  @Post('by-user')
  getTicketByUser(
    @User() user: IUser,
  ) {
    return this.ticketsService.findByUser(user);
  }

  @Public()
  @Get()
  @ResponseMessage('Fetch all Room ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {

    return this.ticketsService.findAll(+currentPage, +pageSize, qs);
  }
  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a Film by id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser) {
    return this.ticketsService.remove(id, user);
  }

  @Post('by-user')
  @ResponseMessage('Get Tickets by user')
  getTicketsByUser(@User() user: IUser) {
    return this.ticketsService.findByUser(user);
  }
}
