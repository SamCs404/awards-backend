const express = require('express');
const cors = require('cors');           // Import CORS to handle cross-origin requests
const mongoose = require('mongoose');   // Import Mongoose for MongoDB connection
require('dotenv').config();             // Import dotenv to load environment variables

const app = express();

// Enable CORS for your specific frontend (replace with your Netlify frontend URL)
app.use(cors({
  origin: ['https://whimsical-pudding-0fad50.netlify.app/']  // Replace this with your Netlify URL
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose schema and model for Awardees
const awardeeSchema = new mongoose.Schema({
  slNo: String,
  name: String,
  category: String,
  remarks: String,
  image: String  // Store the image as a base64 string or URL
});

const Awardee = mongoose.model('Awardee', awardeeSchema);

// Routes

// GET: Fetch all awardees
app.get('/awardees', async (req, res) => {
  try {
    const awardees = await Awardee.find();   // Fetch all awardees from MongoDB
    res.json(awardees);                      // Send awardees as JSON response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch awardees' });  // Error handling
  }
});

// POST: Add a new awardee
app.post('/awardees', async (req, res) => {
  try {
    const newAwardee = new Awardee(req.body);  // Create a new awardee document
    await newAwardee.save();                   // Save it to MongoDB
    res.status(201).json(newAwardee);          // Return the created awardee as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to add awardee' });  // Error handling
  }
});

// Root route (optional: just to check if the server is running)
app.get('/', (req, res) => {
  res.send('Backend API is running. Use /awardees to interact with the API.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
