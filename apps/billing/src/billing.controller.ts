import { RmqService } from "@app/common";
import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

import { BillingService } from "@app/billing/billing.service";

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern("order_created")
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data);
    this.rmqService.ack(context);

    // const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();

    // try {
    //   await this.billingService.bill(data);
    //   channel.ack(originalMsg);
    // } catch (error) {
    //   channel.nack(originalMsg);
    //   throw error;
    // }
  }
}
