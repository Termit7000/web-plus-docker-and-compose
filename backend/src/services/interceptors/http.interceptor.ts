import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as Request;
    const { method, url } = req;

    const body = Object(req.body);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...reqBody } = body;

    this.logger.log(`${method} ${url} ${JSON.stringify(reqBody)}`);

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = context.switchToHttp().getResponse();
        this.logger.log(`SUCCESS ${statusCode}`);
      }),
    );
  }
}
