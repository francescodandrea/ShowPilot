FROM php:8.0-apache
RUN docker-php-ext-install mariadb && docker-php-ext-enable mariadb
RUN apt-get update && apt-get upgrade -y

ROM node:12.18-alpine
ENV NODE_ENV production
ENV LISTEN_PORT=3003
WORKDIR /usr/src/app/myapp
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY myapp/ .
CMD npm start