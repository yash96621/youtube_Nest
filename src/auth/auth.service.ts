import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { userlogin } from './AuthDto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async login(dto: userlogin) {
    try {
      console.log(dto);
      const user = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      console.log('user', user);

      const authToken = await this.SignToken(dto.email, dto.name);
      if (!user) {
        const cuser = await this.prisma.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            picture: dto.picture,
          },
        });

        console.log('cuser', cuser);
        return {
          authToken,
          user: cuser,
        };
      } else {
        return {
          authToken,
          user: user,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  //this is generate token
  async SignToken(email: string, name: string): Promise<string> {
    console.log(email, name);
    const id: string = uuid();
    const data = {
      Useremail: email,
      UserName: name,
      Userid: id,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(data, {
      expiresIn: '1d',
      secret: secret,
    });
    return token;
  }

  async Refreshlogin(req: any) {
    try {
      const authToken = await this.SignToken(req.user.email, req.user.name);
      return {
        authToken,
        user: req.user,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
