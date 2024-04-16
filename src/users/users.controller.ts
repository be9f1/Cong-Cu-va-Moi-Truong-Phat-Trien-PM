import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UsersPageOptionsDto } from './dto/user.dto'
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

 @Post()
 @ResponseMessage('Create new user')
 async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
     let newUser = await this.usersService.create(createUserDto, user);
     return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
     }
 }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(
    @Param('id')
    id: string
  ) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @Get()
  @ResponseMessage('Fetch all User ')
  pagination(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {
    
    return this.usersService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Update a user')
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage('Delete a user')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
