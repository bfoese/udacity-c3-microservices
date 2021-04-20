FROM node:14.15-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build --prod && npm prune --production

# Create a second stage to ensure, that the final image will contain only relevant files and will be as small as possible
FROM node:14.15-alpine as production

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/www ./www
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD ["node", "www/server.js"]
