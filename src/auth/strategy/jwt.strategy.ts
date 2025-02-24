import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
// import { User } from '@prisma/client';

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
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.Useremail,
      },
      select: {
        id: true,
        email: true,
        History_save: true,
        name: true,
        notification: true,
        notify_count: true,
        picture: true,
        SubscribeIDs: true,
        Subscriber: true,
        HistoryIds: true,
        LikedVideosIds: true,
        dislike_VideosIds: true,
        Watchlist: true,
      },
    });
    console.log('this is user of user', user);
    return user;
  }
}
