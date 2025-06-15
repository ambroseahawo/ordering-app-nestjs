import { lastValueFrom } from "rxjs";

import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { BILLING_SERVICE } from "@app/orders/constants/services";
import { CreateOrderRequest } from "@app/orders/dto/order.dto";
import { OrdersRepository } from "@app/orders/orders.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest) {
    // return this.ordersRepository.create(request);
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(this.billingClient.emit("order_created", { request }));
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
