FROM node:lts-alpine

ENV PORT 3113
ENV NODE_ENV production

WORKDIR /app

COPY . /app

RUN apk add --no-cache curl
RUN pwd
RUN rm -rf /app/*.tsbuildinfo
RUN rm -rf /app/lib
RUN npm i -g typescript

RUN npm install
RUN npm run tsc

EXPOSE ${PORT}

ENTRYPOINT [ "node" ]
CMD ["--trace-warnings", "/app/lib/index.js"]

