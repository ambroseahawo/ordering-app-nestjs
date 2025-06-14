import { NestFactory } from "@nestjs/core";

import { OrdersModule } from "@app/orders/orders.module";

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
