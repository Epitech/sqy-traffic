import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const twitterAccounts = [
  "RERC_SNCF",
  "lignesNetU_SNCF",
  "RemiTrainPCLM",
  "InfoSqybus",
  "CarsHourtoule",
  "StavoInfoLignes",
  "TransdevSud78",
  "ALBATRANS91",
  "Actu_Savac",
]

async function main() {
  await prisma.$connect();

  for (const account of twitterAccounts) {
      await prisma.tweeterAccount.create({
        data: {
            name: account
        }
      })
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })