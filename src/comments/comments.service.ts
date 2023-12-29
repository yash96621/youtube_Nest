// import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddCommentsDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async addcomment(dto: AddCommentsDto, id) {
    try {
      const comment = await this.prisma.comments.create({
        data: {
          message: dto.comment,
          User: {
            connect: {
              id: id,
            },
          },
          video: {
            connect: {
              id: dto.Video_id,
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          message: true,
          User: {
            select: {
              picture: true,
              name: true,
              id: true,
            },
          },
        },
      });
      console.log('comment added in backend', comment);
      return comment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getcommetnsvideo(videoid: string, skip, limit) {
    try {
      const comment = await this.prisma.video.findUnique({
        where: {
          id: videoid,
        },
        select: {
          Comments: {
            take: limit,
            skip: skip,
            select: {
              id: true,
              createdAt: true,
              message: true,
              User: {
                select: {
                  picture: true,
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      console.log('comments', comment);
      return comment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
