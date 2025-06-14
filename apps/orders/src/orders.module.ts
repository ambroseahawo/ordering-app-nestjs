import * as Joi from "joi";

import { DatabaseModule, RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { BILLING_SERVICE } from "@app/orders/constants/services";
import { OrdersController } from "@app/orders/orders.controller";
import { OrdersRepository } from "@app/orders/orders.repository";
import { OrdersService } from "@app/orders/orders.service";
import { Order, orderSchema } from "@app/orders/schemas/order.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: "./apps/orders/.env",
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    RmqModule.register({ name: BILLING_SERVICE }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
