const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();
app.use(cors());

// Increase the payload limit
app.use(express.json({ limit: '10mb' }));  // Increase the JSON body size limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // Increase the URL-encoded body size limit to 10MB

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb+srv://samarthasamurai:pro1236@cluster0.3plio.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define a Mongoose schema and model for Awardees
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
      const awardees = await Awardee.find();  // Fetch all awardees from MongoDB
      res.json(awardees);  // Return the awardees as JSON
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch awardees' });  // Handle errors
    }
  });
  

// POST: Add a new awardee
app.post('/awardees', async (req, res) => {
  const newAwardee = new Awardee(req.body);
  await newAwardee.save();
  res.status(201).json(newAwardee);
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Backend API is running. Use /awardees to interact with the API.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
