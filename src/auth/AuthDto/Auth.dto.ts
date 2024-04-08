import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class userlogin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  picture: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  systemSceretKey: string;
}
