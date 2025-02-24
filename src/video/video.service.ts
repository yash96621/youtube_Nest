import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import {
  Names,
  UploadFileName,
  data,
  search,
  suggestion,
  videoup,
} from './dto/video.dto';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getSignedurl(dto: Names) {
    try {
      const s3 = this.getS3();

      const myBucket = process.env.BUCKET_NAME;
      const signedUrlExpireSeconds = 60 * 20;
      const Videoname = dto.VideoName;
      const Imagename = dto.ImageName;

      const VideoUrl = await s3.getSignedUrlPromise('putObject', {
        Bucket: myBucket,
        Key: Videoname,
        Expires: signedUrlExpireSeconds,
        ContentType: dto.VideoType,
      });
      const ImageUrl = await s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        Key: Imagename,
        Expires: signedUrlExpireSeconds,
        ContentType: dto.ImageType,
      });
      console.log('VideoUrl', VideoUrl);
      console.log('ImageUrl', ImageUrl);
      return {
        video: {
          VideoUrl,
          Videoname,
        },
        image: {
          ImageUrl,
          Imagename,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

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
      console.log(
        '🚀 ~ VideoService ~ deletevideo ~ S3thumbnail:',
        S3thumbnail,
      );
      // Perform S3 deletions in parallel
      const videoname = await this.getFileNameFromS3Url(S3video);
      console.log('🚀 ~ VideoService ~ deletevideo ~ videoname:', videoname);
      const imagename = await this.getFileNameFromS3Url(S3thumbnail);
      console.log('🚀 ~ VideoService ~ deletevideo ~ imagename:', imagename);

      await Promise.all([this.deletes3(videoname), this.deletes3(imagename)]);

      // Delete the video record from the database
      await this.prisma.video.delete({
        where: {
          id: videoid,
        },
      });

      return { id: videoid };
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new InternalServerErrorException();
    }
  }

  async getFileNameFromS3Url(s3Url: string) {
    // Split the URL by '/'
    const urlParts = s3Url.split('/');
    // Get the last part which contains the file name
    const fileName = urlParts[urlParts.length - 1];
    // Decode the URL-encoded file name
    const decodedFileName = decodeURIComponent(fileName);
    return decodedFileName;
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
    data: any,
  ) {
    try {
      const uploadPromises = [];
      if (files.picture) {
        const pic = files.picture[0].originalname;
        uploadPromises.push(this.uploadS3(files.picture[0].buffer, pic));
      }
      if (files.bgimage) {
        const bg = files.bgimage[0].originalname;
        uploadPromises.push(this.uploadS3(files.bgimage[0].buffer, bg));
      }

      const [presult, bgresult] = await Promise.all(uploadPromises);

      const updateData: any = {};
      if (files.picture && presult) {
        updateData.picture = presult.Location;
      }
      if (files.bgimage && bgresult) {
        updateData.bgimage = bgresult.Location;
      }
      if (data.name) {
        updateData.name = data.name;
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          picture: !!updateData.picture,
          bgimage: !!updateData.bgimage,
          name: !!updateData.name,
        },
      });

      return {
        picture: user.picture || null,
        bgimage: user.bgimage || null,
        name: user.name || null,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async UploadedVideoAdd(dto: UploadFileName, email: string) {
    try {
      console.log('dto', dto);
      console.log('email', email);

      const user = await this.prisma.user.update({
        where: { email: email },
        data: {
          Uploaded_video: {
            create: {
              video_name: dto.name,
              video_link: `${this.config.get('PreLocation')}${dto.VideoName}`,
              thumbnail_link: `${this.config.get('PreLocation')}${
                dto.ImageName
              }`,
              description: dto.des,
              Categorys: dto.cat,
              Search_key: dto.searchkey,
            },
          },
        },
        select: {
          id: true,
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

      Promise.all([
        await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            SubscribeBy: {
              updateMany: {
                where: {
                  SubscribeIDs: {
                    has: user.id,
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
        }),
      ]);
      console.log(user);
      return user;
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
    id: string,
  ) {
    try {
      const vname = video[0].originalname;
      const tname = thumbnail[0].originalname;
      const cat = dto.cat.split(',');
      const key = dto.searchkey.split(',');

      const [vresult, tresult] = await Promise.all([
        this.uploadS3(video[0].buffer, vname),
        this.uploadS3(thumbnail[0].buffer, tname),
      ]);

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
        where: { email: email },
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
      accessKeyId: this.config.get('ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('SECRET_ACCESS_KEY'),
    });
  }

  async deletes3(Key: string): Promise<any> {
    console.log('this is bucket', this.config.get('BUCKET_NAME'));
    const s3 = this.getS3();
    const params = {
      Bucket: this.config.get('BUCKET_NAME'),
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
