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

@Controller('subscription')
export class SubscriptionController {
  constructor(private sub: SubscriptionService) {}

  @Get('getsubscribe')
  getsubscribe(@GetUser('email') email: string) {
    return this.sub.getsubscribe(email);
  }
}
