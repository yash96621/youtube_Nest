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
      if (dto.opration) {
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
      } else {
        const user = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            History: {
              disconnect: {
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
          data: { views: { decrement: 1 } },
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
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            likes: { increment: 1 },
            Liked_Videos: {
              connect: {
                email: email,
              },
            },
          },
          select: {
            id: true,
          },
        });
      } else {
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            likes: { decrement: 1 },
            Liked_Videos: {
              disconnect: {
                email: email,
              },
            },
          },
          select: {
            id: true,
          },
        });
      }
      return dto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async AdddisLikedVideo(email: string, dto: dislike) {
    try {
      if (dto.operation) {
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            dislikes: { increment: 1 },
            dislike_Videos: {
              connect: {
                email: email,
              },
            },
          },
          select: {
            id: true,
          },
        });
      } else {
        await this.prisma.video.update({
          where: {
            id: dto.VideoId,
          },
          data: {
            dislike_Videos: {
              disconnect: {
                email: email,
              },
            },
            dislikes: { decrement: 1 },
          },
          select: {
            id: true,
          },
        });
      }
      return dto;
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
            take: 1,
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
            take: 1,
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

  async geteachlibrary(email: string, skip, limit, library) {
    try {
      if (library === 'Liked_Videos') {
        const user = await this.prisma.user.findUnique({
          where: {
            email: email,
          },

          select: {
            Liked_Videos: {
              skip: skip,
              take: limit,
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
        console.log('Liked_videos this is' + user);
        return user;
      } else if (library === 'Watch_List') {
        const user = await this.prisma.user.findUnique({
          where: {
            email: email,
          },

          select: {
            Watchlist: true,
          },
        });
        const videos = await this.prisma.video.findMany({
          where: {
            id: {
              in: user.Watchlist,
            },
          },
          skip: skip,
          take: limit,
          select: {
            createdAt: true,
            id: true,
            likes: true,
            uploaded_Info: true,
            thumbnail_link: true,
            views: true,
            video_name: true,
          },
        });

        console.log('Watch_list this is' + videos);

        return videos;
      } else if (library === 'History') {
        const user = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            History: {
              take: limit,
              skip: skip,
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
        console.log('history this is' + user);
        return user;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
