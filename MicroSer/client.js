const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the gRPC proto file
const PROTO_PATH = path.join(__dirname, 'hotel.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const hotelProto = grpc.loadPackageDefinition(packageDefinition).hotel;

// Create gRPC client
const client = new hotelProto.HotelService('localhost:50052', grpc.credentials.createInsecure());

// Function to get a room by ID
function getRoomById(roomId) {
  const request = { room_id: roomId };
  client.GetRoom(request, (error, response) => {
    if (error) {
      console.error('Error getting room by ID:', error.message);
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response);
      if (response.room) {
        console.log('Room retrieved successfully:', response.room);
      } else {
        console.error('Room not found');
      }
    }
  });
}

// Function to search rooms by view
function searchRoomsByView(query) {
  const request = { query: query };
  client.SearchRooms(request, (error, response) => {
    if (error) {
      console.error('Error searching rooms by view:', error.message);
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response);
      if (response.rooms && response.rooms.length > 0) {
        console.log('Rooms found with the specified view:', response.rooms);
      } else {
        console.error('No rooms found with the specified view');
      }
    }
  });
}

// Example usage: Get room by ID
getRoomById('1');

// Example usage: Search rooms by view
searchRoomsByView('City');
