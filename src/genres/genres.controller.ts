import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import {  CreateGenreDto } from './dto/genre.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto,
    @User() user : IUser,
    
  ) {
    return this.genresService.create(createGenreDto,
      user
      );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: CreateGenreDto,
  @User() user : IUser) {
    return this.genresService.update(id, updateGenreDto,user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user : IUser) {
    return this.genresService.remove(id, user);
  }

  // @Get()
  // @ResponseMessage('Fetch all Genre ')
  // pagination(
  //   @Query() pageOptionsDto: GenresPageOptionsDto,
  //   @Query('limit') limit: string,
  //   @Query() q: string,) {
    
  //   return this.genresService.findAll(pageOptionsDto);
  // }
  @Get()
  @ResponseMessage('Fetch all Genre ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {
    
    return this.genresService.findAll(+currentPage, +pageSize, qs);
  }

}
