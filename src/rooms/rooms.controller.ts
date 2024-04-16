import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Put } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/room.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto,
    @User() user: IUser,

  ) {
    return this.roomsService.create(createRoomDto,
      user
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: CreateRoomDto,
    @User() user: IUser) {
    return this.roomsService.update(id, updateRoomDto, user);
  }

  @Put(':id/slect/')
  selectSteat(
    @Param('id') id: string, 
    @Body() seats: 
      {
        id: string,
        status: string
      }[],
    @User() user: IUser
  ) {
    return this.roomsService.selectSteat(id, seats, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser) {
    return this.roomsService.remove(id, user);
  }

  // @Get()
  // @ResponseMessage('Fetch all Room ')
  // pagination(
  //   @Query() pageOptionsDto: RoomsPageOptionsDto,
  //   @Query('limit') limit: string,
  //   @Query() q: string,) {

  //   return this.roomsService.findAll(pageOptionsDto);
  // }

  @Public()
  @Get()
  @ResponseMessage('Fetch all Room ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {

    return this.roomsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a Film by id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Get('cinema/:cinemaId')
  findAllByCinemaId(@Param('cinemaId') cinemaId: string) {
    return this.roomsService.findAllByCinemaId(cinemaId);
  }

}


