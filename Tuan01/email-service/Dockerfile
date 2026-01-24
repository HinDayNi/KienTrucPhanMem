FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY email.js .

CMD ["npm", "start"]
