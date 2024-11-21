import express from "express";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Enable CORS
app.use(cors()); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB setup
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Connection to MongoDB established");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure if connection fails
  });

// Define Mongoose models
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  aadhar: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}));

const Donation = mongoose.model('Donation', new mongoose.Schema({
  transactionHash: { type: String, required: true },
  senderAddress: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  donationAmount: { type: Number, required: true },
  timestamp: { type: Date, required: true },
}));

const Feedback = mongoose.model('Feedback', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}));

// Test Route to check if API is working
app.get("/", (req, res) => {
  res.send("API is working");
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, password, aadhar, email, phone } = req.body;

  try {
    if (!username || !password || !aadhar || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const newUser = new User({
      username,
      password: hashedPassword,
      aadhar,
      email,
      phone,
    });
    
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "User not found" });

    // Compare the password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Donation Route
app.post("/donate", async (req, res) => {
  // Extract fields from the request body
  const { transactionHash, senderAddress, recipientAddress, donationAmount, timestamp } = req.body;

  // Validate the data
  if (!transactionHash || !senderAddress || !recipientAddress || !donationAmount || !timestamp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save the donation details to the MongoDB database
    const newDonation = new Donation({
      transactionHash,
      senderAddress,
      recipientAddress,
      donationAmount,
      timestamp,
    });

    await newDonation.save();

    // Respond with a success message
    res.status(201).json({ message: "Donation submitted successfully!" });
  } catch (error) {
    console.error("Error submitting donation:", error);
    res.status(500).json({ message: "Error submitting donation" });
  }
});

// Get Donations for a specific temple address
app.get("/transactions/:address", async (req, res) => {
  const { address } = req.params;

  try {
    const transactions = await Donation.find({ templeAddress: address });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Submit Feedback
app.post("/feedback", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

// Fetch Feedback
app.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    res.status(500).json({ message: "Error fetching feedback data" });
  }
});

// Start the server after the DB is connected
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
