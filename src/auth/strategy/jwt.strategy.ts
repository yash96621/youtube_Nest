import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // key value 'jwt' is for identify fot authguad
  //by defualt it is 'jwt' black or written is right

  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    Useremail: string;
    UserName: string;
    Userid: string;
  }): Promise<any> {
    const user: User =
      null ||
      (await this.prisma.user.findUniqueOrThrow({
        where: {
          email: payload.Useremail,
        },
        include: {
          History: {
            select: {
              id: true,
              thumbnail_link: true,
              views: true,
              video_name: true,
              createdAt: true,
              uploaded_Info: {
                select: {
                  name: true,
                },
              },
            },
          },
          Liked_Videos: {
            select: {
              id: true,
              thumbnail_link: true,
              views: true,
              video_name: true,
              createdAt: true,
              uploaded_Info: {
                select: {
                  name: true,
                },
              },
            },
          },
          Uploaded_video: {
            select: {
              id: true,
              thumbnail_link: true,
              views: true,
              likes: true,
              video_name: true,
            },
          },
        },
      }));
    console.log(user);
    return user;
  }
}
