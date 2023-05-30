import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class historyturn {
  @IsNotEmpty()
  @IsBoolean()
  History_save: boolean;
}

export class savehistory {
  @IsNotEmpty()
  @IsString()
  VideoId: string;
}
