import { Test, TestingModule } from "@nestjs/testing";

import { OrdersController } from "@app/orders/orders.controller";
import { OrdersService } from "@app/orders/orders.service";

describe("OrdersController", () => {
  let ordersController: OrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(ordersController.getHello()).toBe("Hello World!");
    });
  });
});
