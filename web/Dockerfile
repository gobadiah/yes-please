FROM node:6.12.3

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

ENV NODE_ENV production

RUN yarn install

COPY . .

RUN npm run build

ENV PORT 8080

EXPOSE 8080 

CMD npm run start
