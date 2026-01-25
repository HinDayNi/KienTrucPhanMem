FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY auth.js .

CMD ["npm", "start"]
