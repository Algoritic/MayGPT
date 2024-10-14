FROM node:20 as builder
WORKDIR /app
COPY ./package*.json .
RUN npm config set proxy http://10.170.104.30:8080
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine as runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]