FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD [ "npm" ,"run" ,"start:prod" ]