import { IsArray, IsNotEmpty, IsString, isNotEmpty } from 'class-validator';

export class videoup {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  des: string;

  @IsString()
  cat: string;

  key: any;
}

export class suggestion {
  @IsArray()
  @IsNotEmpty()
  Categorys: Array<string>;

  @IsString()
  videoId: string;
}
