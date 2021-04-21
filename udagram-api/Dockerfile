# Container crashes at runtime when node:14.15-alpine is being used. With
# node:12 it works. Might be a problem of sequelize - had to change my local
# node version as well, otherwise the sequelize.sync command would never receive
# a callback.
FROM node:12 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build --prod && npm prune --production

# Create a second stage to ensure, that the final image will contain only relevant files and will be as small as possible
FROM node:12 as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/www ./www
COPY --from=builder /usr/src/app/node_modules ./node_modules

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}
EXPOSE 8080

CMD ["node", "./www/server.js"]
