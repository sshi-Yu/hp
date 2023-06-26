import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConf } from './config/server';
import { buildSwaggerConf } from './config/swagger/index.config';
import { RequestLogger } from './common/interceptor/request.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LogService } from './modules/log/log.service';
import { GlobalException } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // swagger document
  buildSwaggerConf(app);

  // add request log
  app.useGlobalInterceptors(new RequestLogger(app.get<LogService>(LogService)));

  // add global exception filter
  app.useGlobalFilters(new GlobalException(app.get<LogService>(LogService)));

  await app.listen(serverConf.port);
}
bootstrap();
