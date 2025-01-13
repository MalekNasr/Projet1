const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');

// Load the protobuf
const hotelProtoPath = './hotel.proto';
const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  // Define Room model schema
  const roomSchema = new mongoose.Schema({
    id: String,
    number: Number,
    floor: Number,
    view: String,
  });

  const Room = mongoose.model('Room', roomSchema);

  // Function to add a sample room
  function addSampleRoom() {
    const sampleRoom = new Room({
      id: '3',
      number: 103,
      floor: 1,
      view: 'City',
    });

    sampleRoom.save()
      .then(room => {
        console.log('Sample room added successfully:', room);
      })
      .catch(err => {
        console.error('Error adding sample room:', err);
      });
  }

  // Call the function to add a sample room
  addSampleRoom();

  // Implement gRPC methods
  const hotelService = {
    getRoom: async (call, callback) => {
      try {
        const roomId = call.request.room_id;
        const room = await Room.findOne({ id: roomId }).exec();
        if (!room) {
          throw new Error('Room not found');
        }
        callback(null, { room });
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }
    },
    searchRooms: async (call, callback) => {
      try {
        const query = call.request.query;
        const rooms = await Room.find({ view: query }).exec();
        if (rooms.length === 0) {
          throw new Error('No rooms found with the specified view');
        }
        callback(null, { rooms });
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }
    },
  };

  // Create gRPC server
  const server = new grpc.Server();
  server.addService(hotelProto.HotelService.service, hotelService);

  // Start the server
  const PORT = process.env.PORT || '50052';
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
    } else {
      console.log(`Server running on port ${port}`);
      server.start();
    }
  });
});
