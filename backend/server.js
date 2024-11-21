import express from "express";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./connectDB"; // Import the connectDB function

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

// Connect to MongoDB before starting the server
connectDB();

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
    await mongoose.connection.db.collection("users").insertOne({
      username,
      password: hashedPassword,
      aadhar,
      email,
      phone,
      timestamp: new Date(),
    });

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
    const user = await mongoose.connection.db.collection("users").findOne({ username });
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
    await mongoose.connection.db.collection("donations").insertOne({
      transactionHash,
      senderAddress,
      recipientAddress,
      donationAmount,
      timestamp,
    });

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
    const transactions = await mongoose.connection.db.collection("donations").find({ templeAddress: address }).toArray();
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

    await mongoose.connection.db.collection("feedback").insertOne({ name, email, message });
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

// Fetch Feedback
app.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await mongoose.connection.db.collection("feedback").find().toArray();
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
