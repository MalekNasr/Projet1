const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const resolvers = require('../Conn/resolvers');
const typeDefs = require('./schema');
const path = require('path'); // Import the path module

// Create a new Express application
const app = express();

// Define the paths to the proto files
const hotelProtoPath = path.join(__dirname, '..', 'MicroSer', 'hotel.proto');
const userProtoPath = path.join(__dirname, '..', 'MicroServ', 'user.proto');

const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;
const userProto = grpc.loadPackageDefinition(userProtoDefinition).hotel; 

// Create an ApolloServer instance with the imported schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Apply ApolloServer middleware to the Express application
server.applyMiddleware({ app });

// Define routes for handling requests to hotel and user services
app.get('/hotel/:id', (req, res) => {
  const client = new hotelProto.HotelService('localhost:50052', grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getRoom({ room_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.room);
    }
  });
});

app.get('/user/:id', (req, res) => {
  const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getUser({ user_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.user);
    }
  });
});

// Start the Express application
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
