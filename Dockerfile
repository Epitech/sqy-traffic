FROM node:15.14.0-alpine3.10

WORKDIR  /app

COPY . /app

RUN      npm run generate
RUN      npm install && npm run build

ENV     PORT                  3000
ENV     USERNAME_CHECKER      PoCInnovation
ENV     TW_API_URL            https://api.twitter.com/v2
ENV     TW_BEARER_TOKEN       "AAAAAAAAAAAAAAAAAAAAAEwlKQEAAAAA%2FaxU%2F9GAfdDInpH88muoBnD2wIY%3DO8W9TskqivJkIlAdUCVfLAw6YOkiNR12R28SjZYIuDwONSWk0u"
ENV     NODE_ENV              production
ENV     ENV                   DEV

CMD ["npm", "start"]
