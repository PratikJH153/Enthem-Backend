# syntax=docker/dockerfile:1
   
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm i ts-node typescript
COPY . .
COPY .env .
RUN npm run build
ENV PORT=8080, SOCKET_PORT=8000
EXPOSE 8080, 8000
CMD [ "npm","start" ]
