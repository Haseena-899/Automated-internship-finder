import React, { useState } from 'react';
import './App.css';
function App() {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [message, setMessage] = useState('');
 const handleSubmit = (e) => {
 e.preventDefault();
 if (username === 'admin' && password === '1234') {
 setMessage('Login successful!');
 } else {
 setMessage('Invalid credentials!');
 }
 };
 return (
 <div className="App">
 <h2>Login Form</h2>
 <form onSubmit={handleSubmit}>
 <div>
 <label>Username:</label><br />
 <input 
 type="text" 
 value={username}
 onChange={(e) => setUsername(e.target.value)} 
 required
 />
 </div>
 <div>
 <label>Password:</label><br />
 <input 
 type="password" 
 value={password}
 onChange={(e) => setPassword(e.target.value)} 
 required
 />
 </div>
 <button type="submit">Login</button>
 </form>
 <p>{message}</p>
 </div>
 );
}
export default App;