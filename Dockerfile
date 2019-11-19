FROM node:10.17.0-alpine

RUN apk --no-cache add --virtual builds-deps build-base python git

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY .env.test /usr/src/app/

RUN npm install & npm rebuild bcrypt --build-from-source

COPY . /usr/src/app/

EXPOSE 4000
EXPOSE 5000

CMD ["export", "NODE_ENV=test"]
CMD [ "npm", "run", "start"]
