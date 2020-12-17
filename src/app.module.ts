import { Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { TrafficModule } from "./traffic-module"
import { TwitterModule } from "./twitter-module"

@Module({
  imports: [
    TrafficModule,
    TwitterModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
