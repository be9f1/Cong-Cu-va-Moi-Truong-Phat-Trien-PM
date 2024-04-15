import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CinemasModule } from './cinemas/cinemas.module';
import { GenresModule } from './genres/genres.module'; 
import { FilmsModule } from './films/films.module';
import { FilesModule } from './files/files.module';
import { RoomsModule } from './rooms/rooms.module';
import { TicketsModule } from './tickets/tickets.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './databases/databases.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
          }
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true
    }),

    UsersModule,
    AuthModule,
    CinemasModule,
    GenresModule,
    FilmsModule,
    FilesModule,
    RoomsModule,
    TicketsModule,
    PermissionsModule,
    RolesModule,
    DatabasesModule
  ],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule { }
