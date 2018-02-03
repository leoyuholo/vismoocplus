FROM node:8

ADD . /app
WORKDIR /app

ENV NODE_ENV production

RUN npm install -g yarn
RUN yarn install --production

EXPOSE 1337

CMD node server.js
