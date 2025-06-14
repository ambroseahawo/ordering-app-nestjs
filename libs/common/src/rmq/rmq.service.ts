import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqService {
  constructor(private configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>("RABBIT_MQ_URI")!],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`)!,
        noAck,
        persistent: true,
        // manage rqm connection
        // socketOptions: {
        //   heartbeatIntervalInSeconds: 5,
        //   reconnectTimeInSeconds: 5,
        // },
        // prefetchCount: 1,
        // isGlobalPrefetchCount: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
