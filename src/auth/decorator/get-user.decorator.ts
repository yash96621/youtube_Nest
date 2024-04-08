import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      console.log('request.user', request.user);
      return request.user[data]; // to send perticuler field
    }
    return request.user;
  },
);
