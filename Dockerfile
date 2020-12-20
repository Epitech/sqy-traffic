FROM node:15.4.0-alpine3.10 AS build

WORKDIR  /app

COPY     ./config             ./config
COPY     ./src                ./src
COPY     ./package.json       ./package.json
COPY     ./package-lock.json  ./package-lock.json
COPY     ./tsconfig.json      ./tsconfig.json
COPY     ./prisma             ./prisma

RUN      npm ci && npm run generate && npm run build

FROM node:15.4.0-alpine3.10

WORKDIR /app

ENV     PORT                  3000
ENV     USERNAME_CHECKER      PoCInnovation
ENV     TW_API_URL            https://api.twitter.com/v2
ENV     TW_BEARER_TOKEN       "TOKEN"
ENV     NODE_ENV              production

COPY --from=build /app/dist              /app
COPY --from=build /app/package-lock.json /app
COPY --from=build /app/prisma            /app

RUN NODE_ENV=production npm ci && npm run generate
CMD ["node", "/app/src/index.js"]