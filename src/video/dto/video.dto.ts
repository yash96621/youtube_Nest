import {
  IsArray,
  IsJSON,
  IsNotEmpty,
  IsString,
  isArray,
  isNotEmpty,
} from 'class-validator';

export class videoup {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  des: string;

  @IsString()
  cat: string;

  @IsString()
  searchkey: string;
}

export class suggestion {
  @IsArray()
  @IsNotEmpty()
  Categorys: Array<string>;

  @IsString()
  videoId: string;
}

export class search {
  @IsArray()
  @IsNotEmpty()
  texts: Array<string>;
}
