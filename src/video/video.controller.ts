import { VideoService } from './video.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { videoup } from './dto/video.dto';

@Controller('video')
export class VideoController {
  constructor(private VideoService: VideoService) {}
  @Get('video:id')
  getvideo(@Param('id', ParseIntPipe) videoid: number) {
    return this.VideoService.getvideo(videoid);
  }
  @UseGuards(JwtGuard)
  @Post('videoUpload')
  @UseInterceptors(FileInterceptor('file'))
  uploadvideo(@GetUser('email') email: string, @UploadedFile() file) {
    return this.VideoService.uploadvideo(email, file);
  }
}
