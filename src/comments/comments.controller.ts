import { CommentsService } from './comments.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { AddCommentsDto } from './dto';

//==> controller level guard
@Controller('comments')
export class CommentsController {
  constructor(private CommentsService: CommentsService) {}
  // @UseGuards(('jwt')) // we can simply write this but we seperate  class for guarde
  // @UseGuards(JwtGuard) ==> guard at router level is for perticuler route so we transform that guarde to controller level to appy for app routes
  @UseGuards(JwtGuard)
  @Post('addcomment')
  // addcomments(@GetUser() dto: AddCommentsDto) {// if we have to add custome decorator  then
  // addcomments(@GetUser() user:User , @GetUser('email') email:string) { ==> in this we can get perticuler data from the user
  addcomments(@Body() dto: AddCommentsDto, @GetUser('id') id: string) {
    return this.CommentsService.addcomment(dto, id);
  }

  @Get('getcommentofvideo/:id/:skip/:limit')
  getcommetnsvideo(
    @Param('id') videoid: string,
    @Param('skip', new ParseIntPipe()) skip: number,
    @Param('limit', new ParseIntPipe()) limit: number,
  ) {
    console.log('Comment is comming');
    return this.CommentsService.getcommetnsvideo(videoid, skip, limit);
  }
}
