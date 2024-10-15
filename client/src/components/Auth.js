import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async () => {
        const endpoint = isLogin ? 'login' : 'signup';
        try {
            const response = await axios.post(`http://localhost:5001/api/${endpoint}`, { email, password });
            onLogin(response.data.token);
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <div>
            <h1>{isLogin ? 'Login' : 'Signup'}</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleAuth}>{isLogin ? 'Login' : 'Signup'}</button>
            <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Create an account' : 'Already have an account? Login'}
            </p>
        </div>
    );
};

export default Auth;
