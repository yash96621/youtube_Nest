import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { dislike, historyturn, savehistory } from './dto';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async turnHistory(email: string, dto: historyturn) {
    try {
      const his = !dto.History_save;
      console.log(his);
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          History_save: his,
        },
        select: {
          id: true,
        },
      });
      console.log('turj history', user);
      return {
        History_save: his,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async savehistory(email: string, dto: savehistory) {
    try {
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          History: {
            connect: {
              id: dto.VideoId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const video = await this.prisma.video.update({
        where: { id: dto.VideoId },
        data: { views: { increment: 1 } },
        select: {
          id: true,
        },
      });
      return dto.VideoId;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async clearHistory(email: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          HistoryIds: [],
        },
        select: {
          id: true,
        },
      });

      return {
        Success: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async AddLikedVideo(email: string, dto: dislike) {
    try {
      if (dto.operation) {
        const user = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            Liked_Videos: {
              connect: {
                id: dto.VideoId,
              },
            },
          },
        });
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            likes: { increment: 1 },
          },
          select: {
            id: true,
          },
        });
      } else {
        const user = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            Liked_Videos: {
              delete: {
                id: dto.VideoId,
              },
            },
          },
          select: {
            id: true,
          },
        });

        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            likes: { decrement: 1 },
          },
          select: {
            id: true,
          },
        });
      }

      return dto.VideoId;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async AdddisLikedVideo(email: string, dto: dislike) {
    try {
      if (dto.operation) {
        const user = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            dislike_VideosIds: { push: dto.VideoId },
          },
        });
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            dislikes: { increment: 1 },
          },
          select: {
            id: true,
          },
        });
        console.log(user);
      } else {
        const { dislike_VideosIds } = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            dislike_VideosIds: true,
          },
        });
        await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            dislike_VideosIds: {
              set: dislike_VideosIds.filter((id) => id !== dto.VideoId),
            },
          },
          select: {
            id: true,
          },
        });
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            dislikes: { decrement: 1 },
          },
          select: {
            id: true,
          },
        });
      }
      return dto.VideoId;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getlibrary(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },

        select: {
          History: {
            select: {
              createdAt: true,
              id: true,
              likes: true,
              uploaded_Info: true,
              thumbnail_link: true,
              views: true,
              video_name: true,
            },
          },
          Liked_Videos: {
            select: {
              createdAt: true,
              id: true,
              likes: true,
              uploaded_Info: true,
              thumbnail_link: true,
              views: true,
              video_name: true,
            },
          },
          dislike_VideosIds: true,
          Watchlist: true,
        },
      });
      console.log('libraray this is' + user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
