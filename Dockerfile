# Matrix encryption package has issues with Alpine.
FROM node:20-slim

ENTRYPOINT ["npm", "start", "--"]

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only production

COPY . .