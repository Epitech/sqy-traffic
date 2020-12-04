import { NestFactory } from "@nestjs/core"
import { PORT } from "../config/environnement"
import { AppModule } from "./App"

async function main() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.listen(PORT)
}

main()
