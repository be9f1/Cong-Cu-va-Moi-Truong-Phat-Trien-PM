import { Module } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CinemasController } from './cinemas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cinema, CinemaSchema } from './schemas/cinema.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cinema.name, schema: CinemaSchema }])],
  controllers: [CinemasController],
  providers: [CinemasService]
})
export class CinemasModule {}
