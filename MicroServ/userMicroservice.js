const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');

// Load the protobuf
const userProtoPath = './user.proto';
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  // Define User model schema
  const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    roomNumber: String,
  });

  const User = mongoose.model('User', userSchema);

  // Function to add a sample user
  function addSampleUser() {
    const sampleUser = new User({
      id: '1',
      name: 'John Doe',
      roomNumber: '103',
    });

    sampleUser.save()
      .then(user => {
        console.log('Sample user added successfully:', user);
      })
      .catch(err => {
        console.error('Error adding sample user:', err);
      });
  }

  // Call the function to add a sample user
  addSampleUser();

  // Implement gRPC methods
  const userService = {
    getUser: async (call, callback) => {
      try {
        const userId = call.request.user_id;
        const user = await User.findOne({ id: userId }).exec();
        if (!user) {
          throw new Error('User not found');
        }
        callback(null, { user });
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }
    },
    searchUsers: async (call, callback) => {
      try {
        const query = call.request.query;
        const users = await User.find({ name: query }).exec();
        if (users.length === 0) {
          throw new Error('No users found with the specified name');
        }
        callback(null, { users });
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
  server.addService(userProto.hotel.UserService.service, userService); // Corrected line

  // Start the server
  const PORT = process.env.PORT || '50051';
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
    } else {
      console.log(`Server running on port ${port}`);
      server.start();
    }
  });
});
