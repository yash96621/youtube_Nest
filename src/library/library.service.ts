import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { historyturn } from './dto';

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

  async clearHistory(email: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          history: {},
        },
        include: {
          history: true,
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
}
