import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { search, suggestion, videoup } from './dto/video.dto';
import { User } from '@prisma/client';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getvideo(videoId: string) {
    try {
      console.log(videoId);
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          id: true,
          likes: true,
          Categorys: true,
          thumbnail_link: true,
          video_link: true,
          video_name: true,
          views: true,
          createdAt: true,
          uploaded_Info: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
        },
      });
      console.log('get play video', video);
      return video;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getuploadedvideo(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
        select: {
          Uploaded_video: {
            select: {
              id: true,
              video_name: true,
              createdAt: true,
              thumbnail_link: true,
              views: true,
            },
          },
        },
      });
      console.log('uploadeed videos', user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async Searching(dto: search) {
    try {
      console.log(dto.texts);
      const result = await this.prisma.video.findMany({
        where: {
          Search_key: {
            hasSome: dto.texts,
          },
        },
        select: {
          video_name: true,
        },
      });
      console.log('search result', result);
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getmanyvideo() {
    try {
      const videos = await this.prisma.video.findMany({
        take: 30,
        select: {
          id: true,
          Categorys: true,
          thumbnail_link: true,
          video_name: true,
          views: true,
          createdAt: true,
          uploaded_Info: {
            select: {
              picture: true,
              name: true,
            },
          },
        },
      });
      console.log('videos many ahsdkashd asdkhasd uh', videos);
      return videos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getsuggestionvideo(dto: suggestion) {
    try {
      console.log('tags', dto.Categorys);
      const videos = await this.prisma.video.findMany({
        take: 20,
        where: {
          Categorys: {
            hasSome: dto.Categorys,
          },
          AND: {
            NOT: [
              {
                id: dto.videoId,
              },
            ],
          },
        },
        select: {
          id: true,
          thumbnail_link: true,
          video_name: true,
          views: true,
          createdAt: true,
          uploaded_Info: {
            select: {
              picture: true,
              name: true,
            },
          },
        },
      });
      console.log('suggested Video', videos);
      return videos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async uploadvideo(
    video: Express.Multer.File,
    thumbnail: Express.Multer.File,
    dto: videoup,
    email: string,
  ) {
    try {
      const vname = video[0].originalname;
      const tname = thumbnail[0].originalname;
      const cat = await dto.cat.split(',');
      const key = await dto.searchkey.split(',');

      const vresult = await this.uploadS3(video[0].buffer, vname);
      const tresult = await this.uploadS3(thumbnail[0].buffer, tname);
      console.log(tresult);
      console.log(vresult);
      console.log('keys', key);
      const user = await this.prisma.user.update({
        where: { email: email },
        data: {
          Uploaded_video: {
            create: {
              video_name: dto.name,
              video_link: vresult.Location,
              thumbnail_link: tresult.Location,
              description: dto.des,
              Categorys: cat,
              Search_key: key,
            },
          },
        },
        select: {
          Uploaded_video: {
            where: {
              video_name: dto.name,
            },
            select: {
              id: true,
              video_name: true,
              thumbnail_link: true,
              views: true,
              createdAt: true,
            },
          },
        },
      });
      console.log(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async uploadS3(file, name: string): Promise<any> {
    const s3 = this.getS3();
    const params = {
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Key: `${uuid()}-${name}`,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err: Error, data: object) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
  getS3() {
    return new S3({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    });
  }
}
