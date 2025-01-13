const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf for the hotel and user services
const hotelProtoPath = 'hotel.proto';
const userProtoPath = 'user.proto';

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
const userProto = grpc.loadPackageDefinition(userProtoDefinition).hotel; // Corrected line for user service

// Define resolvers for GraphQL queries
const resolvers = {
  Query: {
    hotel: (_, { id }) => {
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
    hotels: () => {
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

module.exports = resolvers;
