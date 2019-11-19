FROM node:10.7.0-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY .env.test /usr/src/app/

RUN npm install

COPY . /usr/src/app/

RUN yarn install && \
    npm rebuild bcrypt --build-from-source

EXPOSE 4000
EXPOSE 5000

CMD ["export", "NODE_ENV=test"]
CMD [ "npm", "run", "start"]
