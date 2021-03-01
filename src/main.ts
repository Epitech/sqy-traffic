import { NestFactory } from "@nestjs/core"
import AppModule from "./app.module"
import { PORT } from "../config/environnement"

async function main() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.listen(PORT)
}

main()
