import { JwtGuard } from '../auth/guard';
import { LibraryService } from './library.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { GetUser } from '../auth/decorator';

import { dislike, historyturn, savehistory } from './dto';

@UseGuards(JwtGuard)
@Controller('library')
export class LibraryController {
  constructor(private LibraryService: LibraryService) {}

  @Patch('turnHistory')
  turnHistory(@GetUser('email') email: string, @Body() dto: historyturn) {
    console.log(email, dto);
    return this.LibraryService.turnHistory(email, dto);
  }

  @Post('addhistory')
  historysave(@GetUser('email') email: string, @Body() dto: savehistory) {
    return this.LibraryService.savehistory(email, dto);
  }

  @Delete('clearHistory')
  clearHistory(@GetUser('email') email: string) {
    console.log(email);
    return this.LibraryService.clearHistory(email);
  }

  @Post('addLiked')
  AddLiked(@GetUser('email') email: string, @Body() dto: dislike) {
    return this.LibraryService.AddLikedVideo(email, dto);
  }

  @Get('getlibrary')
  getlibrary(@GetUser('email') email: string) {
    return this.LibraryService.getlibrary(email);
  }

  @Get('geteachlibrary/:librarys/:skip/:limit')
  geteachlibrary(
    @GetUser('email') email: string,
    @Param('librarys') library: string,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.LibraryService.geteachlibrary(email, skip, limit, library);
  }

  @Post('adddisLiked')
  AdddisLiked(@GetUser('email') email: string, @Body() dto: dislike) {
    return this.LibraryService.AdddisLikedVideo(email, dto);
  }
}
