import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { videoup } from './dto/video.dto';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getvideo(videoId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        include: {
          Uploaded_video: {
            where: {
              id: videoId,
            },
          },
        },
      });

      delete user.email;
      delete user.HistoryIds;
      delete user.History_save;
      delete user.notification;
      delete user.notify_count;

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getmanyvideo() {
    try {
      const videos = await this.prisma.video.findMany({
        take: 30,
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          uploaded_video: {
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

  async uploadvideo(
    video: Express.Multer.File,
    thumbnail: Express.Multer.File,
    dto: videoup,
    email: string,
  ) {
    try {
      const vname = video[0].originalname;
      const tname = thumbnail[0].originalname;
      const tag = dto.tag.split(',');

      const vresult = await this.uploadS3(video[0].buffer, vname);
      const tresult = await this.uploadS3(thumbnail[0].buffer, tname);
      console.log(tresult);
      console.log(vresult);
      const user = await this.prisma.user.update({
        where: { email: email },
        data: {
          Uploaded_video: {
            create: {
              video_name: dto.name,
              video_link: vresult.Location,
              thumbnail_link: tresult.Location,
              description: dto.des,
              tag: tag,
            },
          },
        },
        include: { Uploaded_video: true },
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
