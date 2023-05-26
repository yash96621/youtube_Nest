import { IsNotEmpty, IsString } from 'class-validator';

export class videoup {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  des: String;

  @IsString()
  tag: String;
}
