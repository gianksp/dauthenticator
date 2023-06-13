
FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json certificate.crt privateKey.key .
RUN npm install
COPY src/ .
EXPOSE 4000
CMD [ "npm", "start"]