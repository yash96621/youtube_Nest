import { IsBoolean, IsNotEmpty } from 'class-validator';

export class historyturn {
  @IsNotEmpty()
  @IsBoolean()
  History_save: boolean;
}
