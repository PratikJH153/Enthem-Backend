# This stage is will install depedencies and will do clean up which ocupioing
# unwanted space
FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /app

COPY . .

RUN apk update && apk upgrade && apk add --no-cache bash git openssh 

RUN npm install

RUN npm run build

RUN rm -rf ./src

# Pdfcreator app
FROM node:18-alpine

# RUN apk update && apk upgrade && apk add --no-cache bash git openssh 

RUN  rm -rf /opt/*

WORKDIR /app

COPY --from=BUILD_IMAGE /app /app

EXPOSE 3500

CMD ["npm", "run", "execute"]