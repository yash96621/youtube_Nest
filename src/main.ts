import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
// import { urlencoded, json } from 'express';
import * as bodyParser from 'body-parser';

// function globalmiddleware(req:Request ,res:Response , next:NextFunction){
//   console.log('this is global middleware');
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: ['*'],
  });
  // app.use(json({ limit: '4gb' }));
  // app.use(urlencoded({ extended: true, limit: '4gb' }));

  app.use(bodyParser.json({ limit: '10gb' }));
  app.use(bodyParser.urlencoded({ limit: '10gb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //to another paramater can not accept
    }),
  ); // to use dto , and also use it global level without this can not effect of dto
  // app.use(globalmiddleware)   //global middleware
  console.log('server is running on', process.env.PORT || 80);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
