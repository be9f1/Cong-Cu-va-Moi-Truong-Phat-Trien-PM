import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CinemasPageOptionsDto, CreateCinemaDto } from './dto/cinema.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  create(@Body() createCinemaDto: CreateCinemaDto,
    @User() user : IUser,
    
  ) {
    return this.cinemasService.create(createCinemaDto,
      user
      );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCinemaDto: CreateCinemaDto,
  @User() user : IUser) {
    return this.cinemasService.update(id, updateCinemaDto,user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user : IUser) {
    return this.cinemasService.remove(id, user);
  }

  // @Get()
  // @ResponseMessage('Fetch all Cinema ')
  // pagination(
  //   @Query() pageOptionsDto: CinemasPageOptionsDto,
  //   @Query('limit') limit: string,
  //   @Query() q: string,) {
    
  //   return this.cinemasService.findAll(pageOptionsDto);
  // }

  @Public()
  @Get()
  @ResponseMessage('Fetch all Cinema ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {
    
    return this.cinemasService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a Film by id')
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(id);
  }

}
