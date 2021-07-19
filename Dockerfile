FROM node:12

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

RUN apt update

RUN apt install mysql-server -y

COPY . /usr/src/app

EXPOSE 3000

CMD [ "./wait-for-it.sh","mysql:3306","--timeout=15", "--", "npm", "start"]
