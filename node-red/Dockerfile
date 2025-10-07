FROM node:18-alpine

WORKDIR /usr/src/node-red

COPY node-red/package.json ./
RUN npm install

COPY node-red/ ./

EXPOSE 1880

CMD ["node", "start-nodered.js"]
