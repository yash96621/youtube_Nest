import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('video')
export class VideoController {
  @Get('video:id')
  getvideo(@Param('id', ParseIntPipe) videoid: number) {
    return 'this is video ';
  }
}
