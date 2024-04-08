import { SubscriptionService } from './subscription.service';
import { Express } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Sse,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { subschannel } from './dto';
import { Observable } from 'rxjs';

@UseGuards(JwtGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private sub: SubscriptionService) {}

  @Get('getsubscribe/:skip/:limit')
  getsubscribe(
    @GetUser('email') email: string,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.sub.getsubscribe(email, skip, limit);
  }

  @Get('getsubscribvideos/:skip/:limit')
  getsubscribvideos(
    @GetUser('email') email: string,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.sub.getsubscribvideos(email, skip, limit);
  }

  @Post('subscribechannel')
  subscribechannel(@GetUser('email') email: string, @Body() dto: subschannel) {
    console.log(email, 'email id');
    return this.sub.subscribechannel(email, dto);
  }

  @Get('getnotification/:skip/:limit')
  getnotification(
    @GetUser('email') email: string,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.sub.getnotification(email, skip, limit);
  }

  @Get('setnoticount/:num')
  setnoticount(@GetUser('email') email: string, @Param('num') num: number) {
    console.log('noticount is done');
    return this.sub.setnoticount(email, num);
  }
}
