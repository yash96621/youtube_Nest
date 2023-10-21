import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { data, search, suggestion, videoup } from './dto/video.dto';

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
              Subscriber: true,
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

  async addwatchlist(videoid: string, op, email: string) {
    try {
      console.log('op', op);
      if (op.operation) {
        const wat = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            Watchlist: {
              push: videoid,
            },
          },
          select: {
            Watchlist: true,
          },
        });
        console.log('watchlist', wat);
      } else {
        const wat = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            Watchlist: true,
          },
        });

        await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            Watchlist: {
              set: wat.Watchlist.filter((id) => id !== videoid),
            },
          },
          select: {
            id: true,
          },
        });
      }
      return videoid;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deletevideo(videoid: string, S3video: string, S3thumbnail: string) {
    try {
      const videodelete = await this.deletes3(S3video);
      const thumbnaildelete = await this.deletes3(S3thumbnail);
      await this.prisma.video.delete({
        where: {
          id: videoid,
        },
      });
      return { id: videoid };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getuploadedvideo(email: string, skip: number, limit: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
        select: {
          Uploaded_video: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              video_name: true,
              createdAt: true,
              thumbnail_link: true,
              video_link: true,
              views: true,
              uploaded_Info: {
                select: {
                  id: true,
                },
              },
            },
            take: limit,
            skip: skip,
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

  async Searching(dto: search, skip, limit) {
    try {
      console.log(dto.texts);
      const result = await this.prisma.video.findMany({
        where: {
          Search_key: {
            hasSome: dto.texts,
          },
        },
        skip: skip,
        take: limit,
        select: {
          video_name: true,
          id: true,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getmanyvideo(skip: number, limit: number, category: string) {
    try {
      let videos;
      console.log('category', category);
      console.log('limit', limit, 'skip:', skip);
      if (category === 'all') {
        videos = await this.prisma.video.findMany({
          take: limit,
          skip: skip,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            thumbnail_link: true,
            video_name: true,
            video_link: true,
            views: true,
            createdAt: true,
            uploaded_Info: {
              select: {
                id: true,
                picture: true,
                name: true,
              },
            },
          },
        });
      } else {
        videos = await this.prisma.video.findMany({
          take: limit,
          skip: skip,
          where: {
            Search_key: {
              hasSome: [category],
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
                id: true,
                picture: true,
                name: true,
              },
            },
          },
        });
      }

      console.log('videos many ahsdkashd asdkhasd uh', videos);
      return videos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getsuggestionvideo(dto: suggestion, skip, limit) {
    try {
      const videocat = await this.prisma.video.findUnique({
        where: {
          id: dto.videoId,
        },
        select: {
          Categorys: true,
        },
      });
      const videos = await this.prisma.video.findMany({
        take: limit,
        skip: skip,
        where: {
          Categorys: {
            hasSome: videocat.Categorys,
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
              id: true,
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

  async edit(
    id: string,
    files: { picture: Express.Multer.File; bgimage: Express.Multer.File },
    data: data,
  ) {
    try {
      console.log('picture', files.picture);
      console.log('bgimage', files.bgimage);

      if (files.picture) {
        const pic = files.picture[0].originalname;
        var presult = await this.uploadS3(files.picture[0].buffer, pic);
      }
      if (files.bgimage) {
        const bg = files.bgimage[0].originalname;
        var bgresult = await this.uploadS3(files.bgimage[0].buffer, bg);
      }

      console.log('presult', presult);
      console.log('bgresult', bgresult);

      if (files.picture) {
        const picture = await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            picture: presult.Location,
          },
          select: {
            picture: true,
          },
        });
      }
      if (files.bgimage) {
        const bgimage = await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            bgimage: bgresult.Location,
          },
          select: {
            bgimage: true,
          },
        });
      }
      if (data.name) {
        const name = await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            name: data.name,
          },
          select: {
            name: true,
          },
        });
      }

      return {
        picture: presult?.Location,
        bgimage: bgresult?.Location,
        name: data.name,
      };
    } catch (error) {}
    throw new Error('Method not implemented.');
  }

  async uploadvideo(
    video: Express.Multer.File,
    thumbnail: Express.Multer.File,
    dto: videoup,
    email: string,
    id: string,
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

      await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          SubscribeBy: {
            updateMany: {
              where: {
                SubscribeIDs: {
                  has: id,
                },
              },
              data: {
                Notification_info: {
                  push: user.Uploaded_video[0].id,
                },
                notify_count: {
                  increment: 1,
                },
              },
            },
          },
        },
        select: {
          Notification_info: true,
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

  async deletes3(Key: string): Promise<any> {
    const s3 = this.getS3();
    const params = {
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Key: Key,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err: Error, data: object) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}
