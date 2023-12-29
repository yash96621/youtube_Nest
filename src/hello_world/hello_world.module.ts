import { Module } from '@nestjs/common';

import { HelloWorldController } from './hello_world.controller';

@Module({
  providers: [],
  controllers: [HelloWorldController],
})
export class HelloWorldModule {}
