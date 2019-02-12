FROM node:8-slim

WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY src ./src
RUN yarn 
CMD ["yarn", "run", "server"]

EXPOSE 3000

