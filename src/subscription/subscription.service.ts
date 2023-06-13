import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { subschannel } from './dto';

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

  async getsubscsubscribechannelribe(email: string, dto: subschannel) {
    try {
      if (dto.sub) {
        const subscribe = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            Subscribe: {
              connect: {
                id: dto.ChannelId,
              },
            },
          },
        });
        await this.prisma.user.update({
          where: {
            id: dto.ChannelId,
          },
          data: {
            Subscriber: { increment: 1 },
          },
        });
        return dto.ChannelId;
      } else {
        const subscribe = await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            Subscribe: {
              disconnect: {
                id: dto.ChannelId,
              },
            },
          },
        });

        await this.prisma.user.update({
          where: {
            id: dto.ChannelId,
          },
          data: {
            Subscriber: { decrement: 1 },
          },
        });
        return dto.ChannelId;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
