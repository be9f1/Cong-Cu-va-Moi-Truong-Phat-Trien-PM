import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/roles/schemas/role.schemas';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';
import { count } from 'console';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name)
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,

    private userService: UsersService,


  ) { }
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.roleModel.count({});

      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin full permission',
            isActive: true,
            permissions: permissions
          },
          {
            name: USER_ROLE,
            description: ' User can use the system',
            isActive: true,
            permissions: [

            ]
          }

        ]);
      }

      if (countUser === 0) {
        const roleAdmin = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const roleUser = await this.roleModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            name: 'admin',
            email: 'admin@gmail.com',
            password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
            age: 20,
            gender: "MALE",
            address: "HCM",
            role: roleAdmin?._id,
          },
          {
            name: 'Drake',
            email: 'tadrake2001@gmail.com',
            password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
            age: 21,
            gender: "MALE",
            address: "HN",
            role: roleAdmin?._id,
          },
          {
            name: 'Test',
            email: 'tadrake2002@gmail.com',
            password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
            age: 21,
            gender: "MALE",
            address: "TB",
            role: roleUser?._id,
          },
        ]);
      }

      if (countUser > 0 && countPermission > 0 && countRole > 0) {
        this.logger.log('>>>>Database is already init');
      }

    }
  }
}
