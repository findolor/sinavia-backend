FROM node:10.17.0-alpine

RUN apk --no-cache add --virtual builds-deps build-base python git

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY .env.test /usr/src/app/

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
