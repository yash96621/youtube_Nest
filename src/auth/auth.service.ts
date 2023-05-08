import { PrismaClient } from '@prisma/client';
import {
  HttpCode,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { userlogin } from './AuthDto';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(private primsa: PrismaClient, private config: ConfigService) {}
  async login(dto: userlogin) {
    try {
      const user = await this.primsa.user.findUnique({
        where: {
          email: dto.email,
        },
      });

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
        });
      } else {
        return user;
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
