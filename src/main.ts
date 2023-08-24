import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
// import { urlencoded, json } from 'express';
import * as bodyParser from 'body-parser';

// function globalmiddleware(req:Request ,res:Response , next:NextFunction){
//   console.log('this is global middleware');
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://65.0.68.166',
      'http://localhost:5000',
      'http://localhost:3000',
    ],
  });
  // app.use(json({ limit: '4gb' }));
  // app.use(urlencoded({ extended: true, limit: '4gb' }));

  app.use(bodyParser.json({ limit: '4gb' }));
  app.use(bodyParser.urlencoded({ limit: '4gb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //to another paramater can not accept
    }),
  ); // to use dto , and also use it global level without this can not effect of dto
  // app.use(globalmiddleware)   //global middleware
  await app.listen(process.env.Port, '0.0.0.0');
}
bootstrap();
