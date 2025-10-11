import { Module } from '@nestjs/common';
import { GatewayController } from '@/gateway.controller';
import { GatewayService } from '@/gateway.service';
import { KafkaModule } from '@libs/kafka';

@Module({
  imports: [KafkaModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
