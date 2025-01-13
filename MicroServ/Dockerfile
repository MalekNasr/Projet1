FROM node:18-alpine

WORKDIR /app

COPY . .
RUN npm install

CMD ["node", "userMicroservice.js"]

EXPOSE 50051
