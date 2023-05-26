import { IsNotEmpty, IsString } from 'class-validator';

export class videoup {
  @IsNotEmpty()
  @IsString()
  name: string;
  des: String;
  tag: String;
}
