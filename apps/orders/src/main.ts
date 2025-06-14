import { NestFactory } from "@nestjs/core";

import { OrdersModule } from "@app/orders/orders.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  await app.listen(port as number);
}
bootstrap();
