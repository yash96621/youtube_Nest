import { User } from '@prisma/client';
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
      // const user = await this.prisma.user.update({
      //   where: {
      //     email: email,
      //   },
      //   data: {
      //     history: {},
      //   },
      //   include: {
      //     history: true,
      //   },
      // });
      // console.log(user);
      // return {
      //   Success: true,
      // };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
