FROM node:8

ADD . /app
WORKDIR /app

ENV NODE_ENV production

RUN yarn install --production

EXPOSE 1337

CMD node server.js
