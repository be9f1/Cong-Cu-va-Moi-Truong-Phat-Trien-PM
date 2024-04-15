export class CreateRoleDto { }
import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresModule } from 'src/genres/genres.module';
import { GenresService } from 'src/genres/genres.service';
import { Role, RoleSchema } from './schemas/role.schemas';
import { RolesService } from './roles.service';


@Module({
  imports: [
    GenresModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule { }