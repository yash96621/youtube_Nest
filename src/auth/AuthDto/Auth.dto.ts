import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class userlogin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  user_photo: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
