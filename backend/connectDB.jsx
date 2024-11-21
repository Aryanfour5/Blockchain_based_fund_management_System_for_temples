import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from your environment variable
    const mongoURI = process.env.MONGODB_URI;

    // Connect to the database
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Once connected, log success
    console.log("✅ Connection to MongoDB established");

  } catch (error) {
    // If an error occurs, log and exit
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure if connection fails
  }
};

export default connectDB;
