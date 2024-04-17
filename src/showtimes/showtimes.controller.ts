import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Put } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto, ShowtimeOptionsDto, UpdateShowtimeDto } from './dto/showtime.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) { }

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto,
    @User() user: IUser,

  ) {
    return this.showtimesService.create(createShowtimeDto,
      user
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto,
    @User() user: IUser) {
    return this.showtimesService.update(id, updateShowtimeDto, user);
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
    return this.showtimesService.selectSteat(id, seats, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Fetch all Room ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {

    return this.showtimesService.findAllShowTime(+currentPage, +pageSize, qs);
  }

  @Get('/pagination')
  getpagination(
    @Query()
    pageOptionsDtop: ShowtimeOptionsDto,
  ) {
    return this.showtimesService.pagination(pageOptionsDtop);
  }
  // @Delete(':id')
  // remove(
  //   @Param('id') id: string,
  //   @User() user: IUser) {
  //   return this.showtimesService.remove(id, user);
  // }

  // @Get()
  // @ResponseMessage('Fetch all Showtime ')
  // pagination(
  //   @Query() pageOptionsDto: ShowtimesPageOptionsDto,
  //   @Query('limit') limit: string,
  //   @Query() q: string,) {

  //   return this.showtimesService.findAll(pageOptionsDto);
  // }

  // @Public()
  // @Get()
  // @ResponseMessage('Fetch all Showtime ')
  // pagination(
  //   @Query('current') currentPage: string,
  //   @Query('pageSize') pageSize: string,
  //   @Query() qs: string,) {

  //   return this.showtimesService.findAll(+currentPage, +pageSize, qs);
  // }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a Film by id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.getById(id);
  }

  @Get('roomId/:roomId')
  findAllByCinemaId(@Param('roomId') roomId: string) {
    return this.showtimesService.findByRoomId(roomId);
  }

  @Get('/findbyids')
  @Public()
  findByIds(@Query('filmId') filmId: string, @Query('roomId') roomId: string) {
    return this.showtimesService.findShowtimesByFilmAndRoom(filmId, roomId);
  }
}


