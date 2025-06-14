import { Body, Controller, Get, Post } from "@nestjs/common";

import { CreateOrderRequest } from "@app/orders/dto/order.dto";
import { OrdersService } from "@app/orders/orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() request: CreateOrderRequest) {
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }
}
