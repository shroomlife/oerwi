FROM node:12.8.1

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

# copy app 
COPY build/ .
COPY server.js .

# copy runtime data
RUN mkdir -p .oerwi
COPY .oerwi/ ./.oerwi

EXPOSE 443
CMD [ "node", "server" ]
