# syntax=docker/dockerfile:1
   
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm i ts-node typescript
COPY . .
COPY .env .
RUN npm run build
ENV PORT=8080
EXPOSE 8080
CMD [ "npm","start" ]