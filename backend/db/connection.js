// Kết nối MongoDB
const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // Thêm dòng này

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://photo-sharing:123@cluster0.jwieqem.mongodb.net/PhotoApp?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;