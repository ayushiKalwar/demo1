FROM node:slim

WORKDIR /app
COPY . /app

RUN npm config set proxy http://btpproxy.mphasis.com:8080 
RUN npm config set https-proxy http://btpproxy.mphasis.com:8080
RUN npm config set strict-ssl false

#RUN npm install
CMD node app.js

EXPOSE 14000