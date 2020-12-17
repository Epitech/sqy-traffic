FROM node:15.4.0-alpine3.10 AS build

WORKDIR  /app

COPY     ./config            ./config
COPY     ./src               ./src
COPY     ./package.json      ./package.json
COPY     ./package-lock.json ./package-lock.json
COPY     ./tsconfig.json     ./tsconfig.json

RUN      npm install && npm ci && npm run build

FROM node:15.4.0-alpine3.10

WORKDIR /app

ENV     PORT                  3000
ENV     USERNAME_CHECKER      PoCInnovation
ENV     TW_API_URL            https://api.twitter.com/v2
ENV     TW_BEARER_TOKEN       ""


COPY --from=build /app/dist /app

CMD ["node", "/app/dist/src/index.js"]