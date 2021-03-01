import { NestFactory } from "@nestjs/core"
import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import AppModule from "./app.module"
import { PORT } from "../config/environnement"

async function main() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.listen(PORT)
}

async function initDb() {
  const client = new PrismaClient()
  await client.$connect().then(() => {
    exec("npm run migrate", (err, stdout, stderr) => {
      if (err) {
        console.info(stderr)
        process.exit(1)
      }
      console.info(stdout)
    })
    exec("npm run seed", (err, stdout, stderr) => {
      if (err) {
        console.info(stderr)
      }
      console.info(stdout)
    })
  })
}

initDb()
main()
