FROM node:10-alpine

RUN adduser -S nodejs

ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

USER nodejs

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY package*.json ./
RUN npm install --production

COPY bin bin
COPY public public
COPY src src
COPY views views

EXPOSE 3000

ENV NODE_ENV production

CMD ["/usr/local/bin/dumb-init", "npm", "start"]
