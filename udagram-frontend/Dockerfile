FROM node:14.15-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

ARG NG_BUILD_CONFIG

RUN npm ci

COPY . ./
RUN npm run build:prod


FROM nginx:1.19.6

# By default there is only an index.html and an 50x.html in the directory
# /usr/share/nginx/html. The index.html will be overwritten in the next step,
# and for now I keep the 50x.html default file, so no deleting of the default
# /html directory. RUN rm -rf /usr/share/nginx/html/*

# copy the built app bundles into the directory, which is defined as nginx root
# directory (see nginx/nginx.conf file)
COPY --from=builder /usr/src/app/www /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
