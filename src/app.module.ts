import { Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { TrafficModule } from "./traffic-module"

@Module({
  imports: [TrafficModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export default class AppModule {}
