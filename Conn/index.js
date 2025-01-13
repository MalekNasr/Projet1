const { ApolloServer } = require('apollo-server');
const { gql } = require('apollo-server');

// Load gRPC modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Define the paths to the proto files
const path = require('path');
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

// Define GraphQL schema
const typeDefs = gql`
  type Room {
    id: String!
    number: Int!
    floor: Int!
    view: String!
  }

  type User {
    id: String!
    name: String!
    roomNumber: String!
  }

  type Query {
    hotelRoom(id: String!): Room
    hotelRooms: [Room]
    user(id: String!): User
    users: [User]
  }
`;

// Define resolvers for GraphQL queries
const resolvers = {
  Query: {
    hotelRoom: (_, { id }) => {
      // Perform gRPC call to the hotel microservice
      const client = new hotelProto.HotelService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getRoom({ room_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.room);
          }
        });
      });
    },
    hotelRooms: () => {
      // Perform gRPC call to the hotel microservice
      const client = new hotelProto.HotelService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchRooms({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.rooms);
          }
        });
      });
    },
    user: (_, { id }) => {
      // Perform gRPC call to the user microservice
      const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getUser({ user_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.user);
          }
        });
      });
    },
    users: () => {
      // Perform gRPC call to the user microservice
      const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchUsers({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.users);
          }
        });
      });
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
