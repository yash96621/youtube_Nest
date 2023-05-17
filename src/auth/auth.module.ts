import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { authmiddleware } from './middleware/auth.middleware';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {    // implement middleware for auth
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authmiddleware).forRoutes('auth/login')
  }
}
 