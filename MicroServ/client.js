const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the gRPC proto file
const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).hotel;

// Create gRPC client
const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

// Function to get a user by ID
function getUserById(userId) {
  const request = { user_id: userId };
  client.GetUser(request, (error, response) => {
    if (error) {
      console.error('Error getting user by ID:', error.message);
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response);
      if (response.user) {
        console.log('User retrieved successfully:', response.user);
      } else {
        console.error('User not found');
      }
    }
  });
}

// Function to search users by name
function searchUsersByName(query) {
  const request = { query: query };
  client.SearchUsers(request, (error, response) => {
    if (error) {
      console.error('Error searching users by name:', error.message);
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response);
      if (response.users && response.users.length > 0) {
        console.log('Users found with the specified name:', response.users);
      } else {
        console.error('No users found with the specified name');
      }
    }
  });
}

// Example usage: Get user by ID
getUserById('1');

// Example usage: Search users by name
searchUsersByName('John Doe');
