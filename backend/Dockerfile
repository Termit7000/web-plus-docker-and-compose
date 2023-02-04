FROM node:16-alpine As builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit
COPY . ./
RUN npm run build && \
    rm -rf ./src

FROM node:16-alpine As production
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev && \
    npm i -g pm2  
COPY --from=builder /app/dist ./
COPY ./.env ./
COPY ./ecosystem.config.js ./
EXPOSE 4000


CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
   
