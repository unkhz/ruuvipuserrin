FROM node:lts-slim
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
RUN npm ci --omit=dev