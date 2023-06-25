import { search, suggestion, videoup } from './dto';
import { VideoService } from './video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('video')
export class VideoController {
  constructor(private VideoService: VideoService) {}
  @Get('getplayingvideo/:id')
  getvideo(@Param('id') videoid: string) {
    return this.VideoService.getvideo(videoid);
  }

  @Get('getmanyvideo/:skip/:limit')
  getmanyvideo(
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.VideoService.getmanyvideo(skip, limit);
  }

  @Post('Searching')
  Searching(@Body() dto: search) {
    return this.VideoService.Searching(dto);
  }

  @Post('SuggestionVideo')
  getsuggestionvideo(@Body() dto: suggestion) {
    return this.VideoService.getsuggestionvideo(dto);
  }

  @UseGuards(JwtGuard)
  @Get('getuploadedvideos')
  getuploadedvideo(@GetUser('email') email: string) {
    console.log('user with uploaded videos', email);
    return this.VideoService.getuploadedvideo(email);
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
    @GetUser('id') id: string,
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
      id,
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
