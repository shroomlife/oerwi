FROM node:12.8.1

WORKDIR /usr/src/app
ENV HOMEDIR=/usr/src/app

# copy runtime data
RUN mkdir -p .oerwi

RUN apt-get update && \
    apt-get install -y openssl && \
    openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 && \
    openssl rsa -passin pass:x -in server.pass.key -out server.key && \
    rm server.pass.key && \
    openssl req -new -key server.key -out server.csr \
        -subj "/C=DE/ST=Baden-Württemberg/L=Asperg/O=oerwi/OU=oerwi/CN=oerwi.app" && \
    openssl x509 -req -days 365 -in server.csr -signkey .oerwi/server.key -out .oerwi/server.crt

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

# copy app 
COPY build/ ./build
COPY server/ ./server

EXPOSE 443
CMD [ "node", "server/index" ]
