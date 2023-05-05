import { CommentsService } from './comments.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AddCommentsDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private CommentsService: CommentsService) {}

  @Post('/addcomment')
  addcomments(@Body dto: AddCommentsDto) {
    return this.CommentsService.addcomment(dto);
  }
}
