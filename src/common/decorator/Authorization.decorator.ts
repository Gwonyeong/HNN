import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Authorization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return request.user;
    } else null;
  },
);
