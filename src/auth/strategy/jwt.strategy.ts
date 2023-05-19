import { Injectable, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // key value 'jwt' is for identify fot authguad
  //by defualt it is 'jwt' black or written is right

  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    Useremail: string;
    UserName: string;
    Userid: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.Useremail,
      },
    });
    console.log(user);
    return user;
  }
}
