import { Catch, HttpException, ArgumentsHost } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { LoggerService } from '@nestjs/common/services';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(HttpException)
export class ServerExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    this.logger.log(`ERROR ${status} ${JSON.stringify(message)}`);

    response.status(status).json(message);
  }
}
