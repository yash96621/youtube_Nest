import { IsBoolean, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class historyturn {
  @IsNotEmpty()
  @IsBoolean()
  History_save: boolean;
}

export class savehistory {
  @IsNotEmpty()
  @IsString()
  VideoId: string;

  @IsNotEmpty()
  @IsBoolean()
  operation: boolean;
}

export class dislike {
  @IsNotEmpty()
  @IsString()
  VideoId: string;

  @IsNotEmpty()
  @IsBoolean()
  operation: boolean;
}
