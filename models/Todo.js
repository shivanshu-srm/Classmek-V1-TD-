const mongoose = require('mongoose');

// Todo Schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the User
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
