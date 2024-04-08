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

export class Names {
  @IsString()
  @IsNotEmpty()
  VideoName: string;

  @IsString()
  @IsNotEmpty()
  VideoType: string;

  @IsString()
  @IsNotEmpty()
  ImageType: string;

  @IsString()
  @IsNotEmpty()
  ImageName: string;
}

export class UploadFileName {
  @IsString()
  @IsNotEmpty()
  VideoName: string;

  @IsString()
  @IsNotEmpty()
  ImageName: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  des: string;

  @IsArray()
  cat: string[];

  @IsArray()
  searchkey: string[];
}
