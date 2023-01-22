FROM node:18

WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci --only production

ENV NODE_ENV=production

COPY . .
CMD ["npm", "start"]