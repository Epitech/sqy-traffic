import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect().then(() => {
      exec('yes "" | npm run migrate', (err, stdout, stderr) => {
        if (err) {
          console.info(stderr)
          process.exit(1)
        }
        console.info(stdout)
      })
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
