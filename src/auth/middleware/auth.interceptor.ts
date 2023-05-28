import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, map } from 'rxjs';

export class authinterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    console.log(req.body);

    return next.handle().pipe(
      map((data) => {
        // using this we can easly get the response data
        return res.json({
          message: ' i change the response',
        });
      }),
    );
  }
}
