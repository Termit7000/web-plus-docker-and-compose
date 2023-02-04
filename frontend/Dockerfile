FROM node:16-alpine As builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit
COPY . ./
RUN npm run build && \
    rm -rf ./src

FROM nginx:1.16.0-alpine As production
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8081

CMD [ "nginx", "-g", "daemon off;" ]