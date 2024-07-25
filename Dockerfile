# syntax=docker/dockerfile:1

ARG CLOUD_LOGGING_ONLY=true
   
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm i ts-node typescript
COPY . .
RUN npm run build

EXPOSE 8080
# EXPOSE 8000
CMD [ "node", "./build/app.js" ]
