const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const frontend = process.env.VITE_FRONTEND_URL;
const app = express();

// Configure CORS
app.use(cors({
    origin: frontend || '*',  // Allow requests from this origin
    methods: ["POST", "GET", "DELETE", "PUT"], // Allow these HTTP methods
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Import the User model
const userModel = require('./User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_STRING)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is running perfectly!' });
});

// Fetch all notes
app.get("/getdata", async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users); // Ensure this is an array
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Add a new note
app.post('/insdata', async (req, res) => {
    const user = req.body;
    const newUser = new userModel(user);

    try {
        const savedUser = await newUser.save();
        res.json(savedUser); // Return the saved note with _id
    } catch (err) {
        res.status(500).json({ error: 'Failed to add note' });
    }
});

// Delete a note by ID
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await userModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// Toggle completion status of a note
app.put('/complete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await userModel.findById(id);
        if (!result) {
            return res.status(404).json({ error: 'Note not found' });
        }

        result.complete = !result.complete;
        await result.save();

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// Start the server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
