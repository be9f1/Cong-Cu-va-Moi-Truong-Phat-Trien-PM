import { Body, Inject, Injectable } from '@nestjs/common';
import { CreateFilmDto, UpdateFilmDto } from './dto/film.dto';
import { Film, FilmDocument } from './schemas/film.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { GenresService } from 'src/genres/genres.service';
import aqp from 'api-query-params';
import * as _ from 'lodash';
import mongoose from 'mongoose';

@Injectable()
export class FilmsService {
  constructor(
    @InjectModel(Film.name)
    private filmModel: SoftDeleteModel<FilmDocument>,
    private genreService: GenresService,
  ) {}

  // async getGenre(genreIds: string[]) {
  //   let genreList = genreIds;
  //   const genres = await this.genreService.findByIds(genreList);
  //   const listGenresDetail = genreIds.map((genreId) => {
  //     const detail = genres.find((genre) => genre.id === genreId);
  //     if (!detail) {
  //       throw new Error('Genre not found');
  //     }
  //     return _.pick(detail, ['id', 'name']);
  //   });
  //   return {
  //     listGenresDetail
  //   };
  // }

  create(createFilmDto: CreateFilmDto, user: IUser) {
    return this.filmModel.create({
      ...createFilmDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
  }

  // async update(
  //   id: string,
  //   upDateFilmDto: UpdateFilmDto, 
  //   user: IUser
  // ): Promise<Film> {
  //   const {name, director, actors = [], genreIds = [], description } = upDateFilmDto;
  //   const filmData = await this.filmModel.findOne({
  //     _id: id , ...user && { userId: user._id }
  //   })
  //   const dataUpdate: any = { ...upDateFilmDto };
  //   const {listGenresDetail } = await this.getGenre(genreIds);
  //   filmData.genres = listGenresDetail || [];
  //   filmData.name = name;
  //   filmData.director = director;
  //   filmData.actors = actors as string[] || [];
  //   filmData.description = description;
  //   // if(filmId){
  //   //   createFilm = filmId;
  //   // }

  //   return this.filmModel.findOneAndUpdate({_id: id}, {
  //     dataUpdate,
  //     updatedBy: {
  //       _id: user._id,
  //       email: user.email,
  //     }
  //   } );
  // }
  async update(_id: string, upadteFilmDto: CreateFilmDto, user: IUser) {
    console.log(upadteFilmDto,
      );
    const update = await this.filmModel.updateOne(
      { _id },
      {
      ...upadteFilmDto, 
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
      }
      
      );
      return update;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection ,population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.filmModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
      
    const result = await this.filmModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort )
      .populate(population)
      .exec();

      return {
        meta: {
          current: currentPage, //trang hiện tại
          pageSize: limit, //số lượng bản ghi đã lấy
          pages: totalPages, //tổng số trang với điều kiện query
          total: totalItems // tổng số phần tử (số bản ghi)
        },
        result //kết quả query
        }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return 'not found film';
    return await this.filmModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    await this.filmModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      })
    return this.filmModel.softDelete({ _id: id });
  }
}
