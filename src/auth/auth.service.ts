import { PrismaService } from './../prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { userlogin } from './AuthDto';
import { response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private primsa: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async login(dto: userlogin) {
    try {
      const user = await this.primsa.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      const authToken = this.SignToken(dto.email, dto.name);
      if (!user) {
        const cuser = await this.primsa.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            user_photo: dto.user_photo,
          },
        });
        response.status(201).json({
          success: true,
          authToken,
          user: cuser,
        });
      } else {
        return {
          success: true,
          authToken,
          user: user,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //this is generate token
  async SignToken(email: string, name: string): Promise<string> {
    const data = {
      Useremail: email,
      UserName: name,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(data, {
      expiresIn: '5h',
      secret: secret,
    });

    return token;
  }
}
