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
  @IsString()
  @IsNotEmpty()
  videoId: string;
}

export class search {
  @IsArray()
  @IsNotEmpty()
  texts: Array<string>;
}

export class data {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class deletevideoS3 {
  @IsString()
  @IsNotEmpty()
  S3video: string;

  @IsString()
  @IsNotEmpty()
  S3thumbnail: string;
}
