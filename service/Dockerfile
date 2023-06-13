
FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
RUN  apt-get update -y && apt-get -y install curl python build-essential git ca-certificates
WORKDIR /opt/app
COPY package.json package-lock.json certificate.crt privateKey.key .
RUN npm install
COPY src/ .
RUN npm install --unsafe-perm
EXPOSE 4000
CMD [ "npm", "start"]