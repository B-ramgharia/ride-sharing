const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ride_sharing';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Ride Schema
const rideSchema = new mongoose.Schema({
    pickup: { type: String, required: true },
    drop: { type: String, required: true },
    price: { type: Number, required: true },
    distance: { type: String },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Ride = mongoose.model('Ride', rideSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pulse_secret_key_2024';

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Register Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token, user: { username, email } });
    } catch (err) {
        res.status(400).json({ error: 'Registration failed', details: err.message });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Login error' });
    }
});

// Ride Endpoints (History)
app.post('/api/rides', authenticate, async (req, res) => {
    try {
        const { pickup, drop, price, distance } = req.body;
        const ride = new Ride({ pickup, drop, price, distance, userId: req.userId });
        await ride.save();
        res.status(201).json(ride);
    } catch (err) {
        res.status(400).json({ error: 'Failed to save ride' });
    }
});

app.get('/api/rides', authenticate, async (req, res) => {
    try {
        const rides = await Ride.find({ userId: req.userId }).sort({ date: -1 });
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rides' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
