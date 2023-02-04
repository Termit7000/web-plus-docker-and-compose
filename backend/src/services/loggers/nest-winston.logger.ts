import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

export const NestWinstonLogger = WinstonModule.forRoot({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'LOGS/all.log' }),
    new winston.transports.File({
      filename: `LOGS/errors.log`,
      level: 'error',
      format: winston.format.printf(
        (info) =>
          `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })} 
          ${info.level.toLocaleUpperCase()}: ${info.message} 
          [${JSON.stringify(info)}] 
          `,
      ),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('STUDENT', {}),
  ),
});
