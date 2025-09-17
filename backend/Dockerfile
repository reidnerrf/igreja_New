FROM node:20-alpine AS base

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]

