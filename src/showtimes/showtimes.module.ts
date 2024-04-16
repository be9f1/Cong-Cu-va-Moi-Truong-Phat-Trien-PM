import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Showtime.name, schema: ShowtimeSchema }])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService]
})
export class ShowtimesModule {}
