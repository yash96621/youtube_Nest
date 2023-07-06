import { User } from '@prisma/client';
import { userlogin } from './AuthDto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { middleguarde } from './middleware/auth.guard';
import { authinterceptor } from './middleware/auth.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guard';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  // @UseGuards(new middleguarde()) // this is use as middleware we choose and implement any one  guarde is easy
  // @UseInterceptors(new authinterceptor)  // using this we can add req,res extra functionality and change the data
  @Post('login')
  login(@Body() dto: userlogin) {
    return this.AuthService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Get('Refreshlogin')
  Relogin(@Req() req: Request) {
    return this.AuthService.Refreshlogin(req);
  }
}
