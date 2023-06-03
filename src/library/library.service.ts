import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { historyturn, savehistory } from './dto';

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
      });
      console.log(user);
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
      });
      console.log('history', user);
      const video = await this.prisma.video.update({
        where: { id: dto.VideoId },
        data: { views: { increment: 1 } },
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
      });
      console.log(user);
      return {
        Success: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async AddLikedVideo(email: string, dto: savehistory) {
    try {
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
      });
      console.log(user);
      return dto.VideoId;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async DeleteLikedVideo(email: string, dto: savehistory) {
    try {
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
      });
      console.log(user);
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
          Watchlist: {
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
