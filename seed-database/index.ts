import Axios from "axios"
import { PrismaClient } from "@prisma/client"
// import fs from "fs"

const accounts = [
  {
    networkName: "sncf",
    twitterAccountName: "RERC_SNCF",
    lines: [{ name: "C" }],
  },
  {
    networkName: "sncf",
    twitterAccountName: "lignesNetU_SNCF",
    lines: [{ name: "N" }, { name: "U" }],
  },
  {
    networkName: "remi",
    twitterAccountName: "RemiTrainPCLM",
    lines: [
      // All ?
    ],
  },
  {
    networkName: "sqybus",
    twitterAccountName: "InfoSqybus",
    lines: [
      { name: "401" },
      { name: "402" },
      { name: "414" },
      { name: "415" },
      { name: "417" },
      { name: "418" },
      { name: "419" },
      { name: "420" },
      { name: "422" },
      { name: "423" },
      { name: "424" },
      { name: "430" },
      { name: "431" },
      { name: "439" },
      { name: "440" },
      { name: "441" },
      { name: "444" },
      { name: "459" },
      { name: "460" },
      { name: "461" },
      { name: "463" },
      { name: "464" },
      { name: "465" },
      { name: "466" },
      { name: "467" },
      { name: "468" },
      { name: "475" },
    ],
  },
  {
    networkName: "hourtoule",
    twitterAccountName: "CarsHourtoule",
    lines: [
      { name: "4" },
      { name: "5" },
      { name: "6" },
      { name: "7" },
      { name: "8" },
      { name: "9" },
      { name: "10" },
      { name: "12" },
      { name: "15" },
      { name: "17" },
      { name: "19" },
      { name: "20" },
      { name: "50" },
      { name: "78" },
    ],
  },
  {
    networkName: "stavo",
    twitterAccountName: "StavoInfoLignes",
    lines: [{ name: "44" }, { name: "45" }, { name: "51" }],
  },
  {
    networkName: "transdev",
    twitterAccountName: "TransdevSud78",
    lines: [
      { name: "4" },
      { name: "23" },

      { name: "61" },
      { name: "67" },
      { name: "78" },
      { name: "501" },

      { name: "16" },

      { name: "77" },

      { name: "12" },
      { name: "89" },

      { name: "502" },
      { name: "503" },
    ],
  },
  {
    networkName: "albatrans",
    twitterAccountName: "ALBATRANS91",
    format: /91[-.]?\d{2}/,
    lines: [{ name: "91-10" }, { name: "91-11" }],
  },
  {
    networkName: "savac",
    twitterAccountName: "Actu_Savac",
    format: /(39[-.]?\d{2}|\d{3})/,
    lines: [
      // Diff Actu vs
      { name: "39-12" },
      { name: "39-17" },
      { name: "39-34" },

      { name: "260" },
      { name: "262" },
      { name: "263" },
      { name: "307" },
    ],
  },

  {
    networkName: "phebus",
    twitterAccountName: "PhebusKeolis",
    lines: [{ name: "54" }],
  },
  {
    networkName: "sncf",
    twitterAccountName: "LIGNEL_sncf",
    lines: [{ name: "L" }],
  },
  {
    networkName: "sncf",
    twitterAccountName: "RERB",
    lines: [{ name: "B" }],
  },
  {
    networkName: "savac",
    twitterAccountName: "Trafic_Savac",
    lines: [
      //
    ],
  },
  {
    networkName: "stile",
    lines: [{ name: "109" }],
  },
  {
    networkName: "noctilien",
    lines: [{ name: "122" }, { name: "145" }],
  },
]

const prisma = new PrismaClient()

interface InstantSystemBus {
  lines: Array<{
    // operatorId: "STIF",
    id: string
    sName: string
    lName: string
    mode: "BUS"
    subNetwork: {
      id: string
      name: string
    }
    // color: string,
    // textColor: string,
    // scheduleSearchMode: string[],
    // scheduleSearchModes: string[],
    // favoriteModes: string[]
  }>
}

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

async function main() {
  const instantSystemBus = "http://prod.instant-system.com/InstantCore/v3/networks/28/lines"
  const { data } = await Axios.get<InstantSystemBus>(instantSystemBus)
  // const data: InstantSystemBus = JSON.parse(fs.readFileSync("./data.json").toString())

  await prisma.$connect()

  for (const account of accounts) {
    try {
      await prisma.network.create({
        data: {
            name: account
        }
      }).catch(e => {
        console.log(`An erroe has occured when creating account in database ${e}`)
      })
    } catch (e) {
      console.log((e as Error).message);
    }

    const formatNetworkName = normalize(account.networkName)
    let found = false
    for (const dataLine of data.lines) {
      const formatLine: InstantSystemBus["lines"][0] = {
        ...dataLine,
        sName: normalize(dataLine.sName),
        lName: normalize(dataLine.lName),
        subNetwork: {
          id: dataLine.subNetwork.id,
          name: normalize(dataLine.subNetwork.name),
        },
      }

      if (formatNetworkName === formatLine.subNetwork.name) {
        found = true
        for (const lineName of account.lines) {
          const formatLineName = normalize(lineName.name)
          if (formatLineName === formatLine.lName || formatLineName === formatLine.sName) {
            try {
              await prisma.lines.create({
                data: {
                  name: formatLineName,
                  instantSystemId: formatLine.id,
                  network: {
                    connect: {
                      networkName: account.networkName,
                    },
                  },
                },
              })
            } catch (e) {
              console.log(formatLineName);
            }
          }
        }
      }
    }
    if (!found) {
      console.log("failed", account.networkName)
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
