import { SubscriptionService } from './subscription.service';
import { Express } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { subschannel } from './dto';

@UseGuards(JwtGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private sub: SubscriptionService) {}

  @Get('getsubscribe')
  getsubscribe(@GetUser('email') email: string) {
    return this.sub.getsubscribe(email);
  }

  @Post('subscribechannel')
  subscribechannel(@GetUser('email') email: string, @Body() dto: subschannel) {
    console.log(email, 'email id');
    return this.sub.getsubscsubscribechannelribe(email, dto);
  }
}
