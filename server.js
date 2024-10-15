const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'mysecretkey';  // Use environment variables in a real-world app

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://shivanshudixit121:Gmail12345%40@cluster0.djoj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/mytodo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');
    
    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

// Register user
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error during signup' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login' });
    }
});

// Get Todos for a user
app.get('/api/todos', verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// Add Todo for a user
app.post('/api/todos', verifyToken, async (req, res) => {
    const { text } = req.body;

    try {
        const newTodo = new Todo({ text, user: req.user.userId });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error adding todo' });
    }
});

// Delete Todo for a user
app.delete('/api/todos/:id', verifyToken, async (req, res) => {
    try {
        await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
