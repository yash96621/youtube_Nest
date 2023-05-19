import { CommentsService } from './comments.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AddCommentsDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard) //==> controller level guard
@Controller('comments')
export class CommentsController {
  constructor(private CommentsService: CommentsService) {}
  // @UseGuards(AuthGuard('jwt')) // we can simply write this but we seperate  class for guarde
  // @UseGuards(JwtGuard) ==> guard at router level is for perticuler route so we transform that guarde to controller level to appy for app routes
  @Post('/addcomment')
  // addcomments(@GetUser() dto: AddCommentsDto) {// if we have to add custome decorator  then
  // addcomments(@GetUser() user:User , @GetUser('email') email:string) { ==> in this we can get perticuler data from the user
  addcomments(@Req() Req: Request) {
    return this.CommentsService.addcomment(Req);
  }
}
