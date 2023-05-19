import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { historyturn } from './dto';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async turnHistory(email: string, dto: historyturn) {
    try {
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          History_save: dto.History_save,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
