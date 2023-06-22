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
        const sub = await this.prisma.user.update({
          where: {
            id: dto.ChannelId,
          },
          data: {
            Subscriber: { increment: 1 },
            SubscribeBy: {
              connect: {
                email: email,
              },
            },
          },
          select: {
            Subscriber: true,
          },
        });
        console.log('subscribe', sub);

        return dto.ChannelId;
      } else {
        const unsub = await this.prisma.user.update({
          where: {
            id: dto.ChannelId,
          },
          data: {
            Subscriber: { decrement: 1 },
            SubscribeBy: {
              disconnect: {
                email: email,
              },
            },
          },
          select: {
            Subscriber: true,
          },
        });

        console.log('unsubscribe', unsub);
        return dto.ChannelId;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getnotification(email: string, num: number) {
    try {
      const notification = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          Notification_info: true,
        },
        take: -20,
      });

      const notifications = await this.prisma.video.findMany({
        where: {
          id: {
            in: notification.Notification_info,
          },
        },
        select: {
          video_name: true,
          thumbnail_link: true,
          uploaded_Info: {
            select: {
              name: true,
              id: true,
              picture: true,
            },
          },
          id: true,
          createdAt: true,
        },
      });
      console.log(notification);
      console.log('notifications', notifications);
      return notifications;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async setnoticount(email: string, num: number) {
    try {
      num = Number(num);
      await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          notification: num,
        },
        select: {
          notification: true,
        },
      });
      return num;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
