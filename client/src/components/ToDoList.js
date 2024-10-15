import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ToDoList = ({ token }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/todos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async () => {
        if (newTodo.trim()) {
            try {
                const response = await axios.post('http://localhost:5001/api/todos', { text: newTodo }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTodos([...todos, response.data]);
                setNewTodo('');
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div>
            <h1>Your To-Do List</h1>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new todo"
            />
            <button onClick={addTodo}>Add</button>

            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        {todo.text} <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
