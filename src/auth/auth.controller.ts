import { userlogin } from './AuthDto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('/login')
  login(@Body() dto: userlogin) {
    return this.AuthService.login(dto);
  }
}
