# app building node
FROM node:latest as build-deps

WORKDIR /usr/src/app
ENV HOMEDIR=/usr/src/app

COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run-script build

# sever node
FROM node:latest

WORKDIR /usr/src/app
ENV HOMEDIR=/usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install --prod --non-interactive

COPY --from=build-deps /usr/src/app/build ./build
COPY server/ ./server

EXPOSE 80
CMD [ "node", "server/index" ]
