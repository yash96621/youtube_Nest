import {
  Names,
  UploadFileName,
  data,
  deletevideoS3,
  search,
  suggestion,
  videoup,
} from './dto';
import { VideoService } from './video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import {
  Body,
  Controller,
  Delete,
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

  @Get('getmanyvideo/:skip/:limit/:category')
  getmanyvideo(
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
    @Param('category') category: string,
  ) {
    return this.VideoService.getmanyvideo(skip, limit, category);
  }

  @UseGuards(JwtGuard)
  @Post('getSignedurl')
  getSignedurl(@Body() dto: Names) {
    console.log('this is getsignurl');
    return this.VideoService.getSignedurl(dto);
  }

  @Post('Searching/:skip/:limit')
  Searching(
    @Body() dto: search,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.VideoService.Searching(dto, skip, limit);
  }

  @Post('SuggestionVideo/:skip/:limit')
  getsuggestionvideo(
    @Body() dto: suggestion,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.VideoService.getsuggestionvideo(dto, skip, limit);
  }

  @UseGuards(JwtGuard)
  @Get('getuploadedvideos/:skip/:limit')
  getuploadedvideo(
    @GetUser('email') email: string,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    console.log('user with uploaded videos', email);
    return this.VideoService.getuploadedvideo(email, skip, limit);
  }

  @UseGuards(JwtGuard)
  @Post('deletevideo/:id')
  deletevideo(
    @Param('id') videoid: string,
    @GetUser('email') email: string,
    @Body() dto: deletevideoS3,
  ) {
    console.log('S3video', dto.S3video, 'S3thumbnail', dto.S3thumbnail);
    return this.VideoService.deletevideo(videoid, dto.S3video, dto.S3thumbnail);
  }

  @UseGuards(JwtGuard)
  @Post('addwatchlist/:id')
  addwatchlist(
    @Param('id') videoid: string,
    @Body() op,
    @GetUser('email') email: string,
  ) {
    console.log('this is watchlist');
    return this.VideoService.addwatchlist(videoid, op, email);
  }

  @UseGuards(JwtGuard)
  @Post('UploadedVideoAdd')
  UploadedVideoAdd(
    @Body() dto: UploadFileName,
    @GetUser('email') email: string,
  ) {
    console.log('email', email);
    return this.VideoService.UploadedVideoAdd(dto, email);
  }

  @UseGuards(JwtGuard)
  @Post('videoUpload') // we can also uses another method to do  this same way
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

  @UseGuards(JwtGuard)
  @Post('edit')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'bgimage', maxCount: 1 },
    ]),
  )
  edit(
    @GetUser('id') id: string,
    @UploadedFiles()
    files: { picture: Express.Multer.File; bgimage: Express.Multer.File },
    @Body() data: data,
  ) {
    console.log('files', files.picture, files.bgimage);
    console.log('id', id);
    console.log('data', data);
    // return 'ok';
    return this.VideoService.edit(id, files, data);
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
