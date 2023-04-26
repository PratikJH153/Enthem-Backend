# syntax=docker/dockerfile:1
   
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm i ts-node typescript
COPY . .
RUN npm run build
ENV PORT=8080
ENV SOCKET_PORT=8000
ENV DB_HOST=${{ secrets.DB_HOST }}
ENV DB_USER=${{ secrets.DB_USER }}
ENV DB_PASSWORD=${{ secrets.DB_PASSWORD }}
ENV DB_PORT=7687
ENV JWT_SECRET=${{ secrets.JWT_SECRET }}
ENV TOKEN=${{ secrets.TOKEN }}
ENV MONGO_DB_URL=${{ secrets.MONGO_DB_URL }}
ENV SECRET_KEY=${{ secrets.SECRET_KEY }}

EXPOSE 8080
EXPOSE 8000
CMD [ "node", "./build/app.js" ]
