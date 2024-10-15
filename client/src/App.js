import React, { useState } from 'react';
import ToDoList from './components/ToDoList';
import Auth from './components/Auth';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <div className="App">
            {token ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <ToDoList token={token} />
                </>
            ) : (
                <Auth onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
