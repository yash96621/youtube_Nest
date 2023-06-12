import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getsubscribe(email: string) {
    try {
      const subscribe = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          Subscribe: {
            select: {
              id: true,
              picture: true,
              name: true,
            },
          },
        },
      });
      console.log(subscribe);
      return subscribe;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
