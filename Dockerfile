# Matrix encryption package has issues with Alpine.
FROM node:18

WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci --omit dev

ENTRYPOINT ["npm", "start", "--"]

COPY . .