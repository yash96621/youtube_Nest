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
} from '@nestjs/common';

import { GetUser } from '../auth/decorator';

import { historyturn, savehistory } from './dto';

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
  AddLiked(@GetUser('email') email: string, @Body() dto: savehistory) {
    return this.LibraryService.AddLikedVideo(email, dto);
  }

  @Get('getlibrary')
  getlibrary(@GetUser('email') email: string) {
    return this.LibraryService.getlibrary(email);
  }
}
