import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CommentsDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsMongoId()
  @IsNotEmpty()
  Video_id: string;
}
