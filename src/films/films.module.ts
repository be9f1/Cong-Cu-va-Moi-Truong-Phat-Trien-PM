import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './schemas/film.schemas';
import { GenresModule } from 'src/genres/genres.module';
import { GenresService } from 'src/genres/genres.service';

@Module({
  imports: [
    GenresModule,
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])],
  controllers: [FilmsController],
  providers: [FilmsService]
})
export class FilmsModule {}
