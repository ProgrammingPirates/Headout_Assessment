FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . . 
RUN mv data /tmp
EXPOSE 8080

CMD ["node", "server.js"]
