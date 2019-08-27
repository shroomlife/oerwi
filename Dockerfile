FROM node:12.8.1

WORKDIR /usr/src/app
ENV HOMEDIR=/usr/src/app

# copy runtime data
RUN mkdir -p .oerwi

RUN apt-get update && apt-get install -y openssl
RUN openssl genrsa -passout pass:x -out .oerwi/server.pass.key 2048
RUN openssl rsa -passin pass:x -in .oerwi/server.pass.key -out .oerwi/server.key
RUN rm .oerwi/server.pass.key
RUN openssl req -new -key .oerwi/server.key -out .oerwi/server.csr \
    -subj "/C=DE/ST=Baden-Württemberg/L=Asperg/O=oerwi/OU=oerwi/CN=oerwi.app"
RUN openssl x509 -req -days 365 -in .oerwi/server.csr -signkey .oerwi/server.key -out .oerwi/server.crt

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

# copy app 
COPY build/ ./build
COPY server/ ./server

EXPOSE 443
CMD [ "node", "server/index" ]
