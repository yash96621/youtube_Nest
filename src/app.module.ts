import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';
import { LibraryModule } from './library/library.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { HelloWorldModule } from './hello_world/hello_world.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommentsModule,
    AuthModule,
    PrismaModule,
    VideoModule,
    LibraryModule,
    SubscriptionModule,
    HelloWorldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
