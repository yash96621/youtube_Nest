import { videoup } from './dto/video.dto';
import { VideoService } from './video.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Express } from 'express';

import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('video')
export class VideoController {
  constructor(private VideoService: VideoService) {}
  @Get('video:id')
  getvideo(@Param('id', ParseIntPipe) videoid: number) {
    return this.VideoService.getvideo(videoid);
  }

  @UseGuards(JwtGuard)
  @Post('videoUpload') // we can also uses another method to do this same way
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  uploadvideo(
    @GetUser('email') email: string,
    @UploadedFiles()
    files: { video: Express.Multer.File; thumbnail: Express.Multer.File },
    @Body() dto: videoup,
  ) {
    console.log(files, dto, email);
    return this.VideoService.uploadvideo(
      files.video,
      files.thumbnail,
      dto,
      email,
    );
  }
}

// using this we can validate file but it is use for single file
// @UploadedFile(
//   new ParseFilePipe({
//     validators: [
//       new MaxFileSizeValidator({ maxSize: 903712320000 }), // 1000*1000 bits :- this parameter cinsduer as bits
//       new FileTypeValidator({ fileType: 'video/*' }), // filetype
//     ],
//   }),
// )
