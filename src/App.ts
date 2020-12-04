import { Module } from "@nestjs/common"
import { TrafficModule } from "./traffic-module"

@Module({
  imports: [TrafficModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
