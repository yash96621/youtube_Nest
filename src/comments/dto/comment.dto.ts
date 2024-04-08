import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AddCommentsDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsMongoId()
  @IsNotEmpty()
  Video_id: string;
}
