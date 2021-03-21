import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import AppModule from "./app.module"
import { version } from "../package.json"
import { PORT } from "../config/environnement"

async function main() {
  const isProd = SQY_TRAFFIC_ENV === "prod"
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.listen(PORT)

  if (!isProd) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle("sqy-traffic API")
      .setDescription("The sqy-traffic API")
      .setVersion(version)
      .build()
    const document = SwaggerModule.createDocument(app, swaggerOptions)
    SwaggerModule.setup("swagger", app, document)
  }
}

main()
