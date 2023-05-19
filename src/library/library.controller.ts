import { JwtGuard } from '../auth/guard';
import { LibraryService } from './library.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '../auth/decorator';

import { historyturn } from './dto';

@UseGuards(JwtGuard)
@Controller('library')
export class LibraryController {
  constructor(private LibraryService: LibraryService) {}

  // @Post('/turnHistory')
  // turnHistory(@GetUser('email') user: User, @Req() req: Request) {
  //   console.log(user);
  //   // return this.LibraryService.turnHistory(req);
  // }

  @Post('/turnHistory')
  turnHistory(@GetUser('email') email: string, @Body() dto: historyturn) {
    console.log(email, dto);
    return this.LibraryService.turnHistory(email, dto);
  }
}
