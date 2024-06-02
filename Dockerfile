FROM node:21
WORKDIR /user/src/app
COPY . .

RUN bun install
EXPOSE 3000

CMD [ "bun" ,"run" ,"start:dev" ]