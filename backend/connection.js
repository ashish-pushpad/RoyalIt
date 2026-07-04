import mongoose from 'mongoose';

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/royalit';
    const DB = await mongoose.connect(uri);
    console.log('Connected to MongoDB', DB.connection.db.databaseName);
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
    throw error;
  }
}

export default connectDB