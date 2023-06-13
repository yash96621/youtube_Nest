import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class subschannel {
  @IsNotEmpty()
  @IsString()
  ChannelId: string;

  @IsNotEmpty()
  @IsBoolean()
  sub: boolean;
}
