# syntax=docker/dockerfile:1

ARG CLOUD_LOGGING_ONLY=true
   
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm i ts-node typescript
COPY . .
RUN npm run build

ENV PORT=8080
ENV SOCKET_PORT=8000
ENV DB_HOST=neo4j+s://b62fcb89.databases.neo4j.io:7687
ENV DB_USER=neo4j
ENV DB_PASSWORD=zgQ1ZyE_FdR8xLdYqi4KmhWrk5KG99_6sK-qQ5jX3Bs
ENV DB_PORT=7687
ENV JWT_SECRET=63b8c78cc41124880c516fb3b9612e65767c3d49a559dd9954ebec7688366ac7
ENV TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXRpa0BnbWFpbC5jb20iLCJuYW1lIjoiUHJhdGlrIEphZGhhdiIsImlhdCI6MTUxNjIzOTAyMn0._JtA_vBvaOVQhee8q5loSA_4pWm1jvPt08e4zxxe650
ENV MONGO_DB_URL=mongodb+srv://Enthem:BjTYh8cJjJWEoVXB@cluster0.ltkqh5k.mongodb.net/?retryWrites=true&w=majority
ENV SECRET_KEY=770A8A65DA156D24EE2A093277530142

EXPOSE 8080
EXPOSE 8000

CMD [ "node", "./build/app.js" ]
