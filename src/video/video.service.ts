import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { videoup } from './dto/video.dto';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}
  async getvideo(videoId: number) {}

  async uploadvideo(
    files: Array<Express.Multer.File>,
    dto: videoup,
    email: String,
  ) {
    // const { originalname } = files;
    // const bucketS3 = 'my-aws-bucket';
    // await this.uploadS3(files.buffer, bucketS3, originalname);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${uuid()}-${name}`,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
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
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
