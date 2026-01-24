FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY order.js .

CMD ["npm", "start"]
