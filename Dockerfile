# syntax=docker/dockerfile:1
   
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
COPY .env .
ENV PORT=8080
EXPOSE 8080
CMD [ "npm","start" ]