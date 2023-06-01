import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

@Injectable()
export class authmiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware', req.body);
    if (
      req.body.systemSceretKey &&
      req.body.systemSceretKey === 'hfd4D#R$@%SAdasdt45FWgt53'
    ) {
      next();
    } else {
      throw new BadRequestException({
        statuscode: 500,
        error: 'Internel server Error',
      });
    }
  }
}
