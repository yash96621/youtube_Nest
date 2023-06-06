import { IsArray, IsNotEmpty, IsString, isNotEmpty } from 'class-validator';

export class videoup {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  des: string;

  @IsString()
  tag: string;
}

export class suggestion {
  @IsArray()
  @IsNotEmpty()
  tag: Array<string>;
}
