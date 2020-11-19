FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i typescript
RUN npm install

COPY . .

EXPOSE 3113

CMD [ "node", "./lib/index.js" ]
