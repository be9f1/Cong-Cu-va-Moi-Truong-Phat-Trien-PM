import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create a Role')
  create(@Body() createRoleDto: CreateRoleDto,
    @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all Role ')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return this.rolesService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a Role by id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Role by id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,) {
    return this.rolesService.update(id, updateRoleDto, user);
  } 

  @Delete(':id')
  @ResponseMessage('Delete a role by id')
  remove(@Param('id') id: string,
    @User() user: IUser,) {
    return this.rolesService.remove(id, user);
  }
}

