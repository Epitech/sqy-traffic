import { Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TweetSchema } from "./model/tweet.entity"
import { TrafficModule } from "./traffic-module"

@Module({
  imports: [
    TrafficModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "root",
      password: "root",
      synchronize: true,
      logging: true,
      entities: [TweetSchema],
    }),
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
