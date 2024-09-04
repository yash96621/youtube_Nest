import { Controller, Get } from '@nestjs/common';

@Controller('')
export class HelloWorldController {
  @Get()
  getHello(): string {
    console.log('hello world');
    return 'Hello World!';
  }
}
