import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresModule } from 'src/genres/genres.module';
import { GenresService } from 'src/genres/genres.service';
import { Permission, PermissionSchema } from './schemas/permission.schemas';
import { PermissionsService } from './permissions.service';


@Module({
  imports: [
    GenresModule,
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
  controllers: [PermissionsController],
  providers: [PermissionsService]
})
export class PermissionsModule { }