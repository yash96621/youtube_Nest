import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

// function globalmiddleware(req:Request ,res:Response , next:NextFunction){
//   console.log('this is global middleware');
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //to another paramater can not accept
    }),
  ); // to use dto , and also use it global level without this can not effect of dto
  // app.use(globalmiddleware)   //global middleware
  await app.listen(process.env.Port, '0.0.0.0');
}
bootstrap();
