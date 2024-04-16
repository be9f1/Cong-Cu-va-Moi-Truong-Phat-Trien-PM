import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto, UpdateFilmDto } from './dto/film.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  create(@Body() createFilmDto: CreateFilmDto,
    @User() user : IUser,
    
  ) {
    console.log('createFilmDto', createFilmDto);
    return this.filmsService.create(createFilmDto,
      user
      );
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() data: UpdateFilmDto,
    @User() user : IUser) {
    return this.filmsService.update(id, data, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user : IUser) {
    return this.filmsService.remove(id, user);
  }

  // @Get()
  // @ResponseMessage('Fetch all Film ')
  // pagination(
  //   @Query() pageOptionsDto: FilmsPageOptionsDto,
  //   @Query('limit') limit: string,
  //   @Query() q: string,) {
    
  //   return this.filmsService.findAll(pageOptionsDto);
  // }
  @Get()
  @Public()
  @ResponseMessage('Fetch all Film ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {
    
    return this.filmsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a Film by id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }
}
