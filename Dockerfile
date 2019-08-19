FROM node:12.8.1

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

COPY . .

EXPOSE 443
CMD [ "node", "./server" ]
