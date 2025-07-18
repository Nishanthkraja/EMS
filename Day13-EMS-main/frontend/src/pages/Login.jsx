import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { saveToken } from '../utils/auth';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { userName, password });
      saveToken(res.data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input value={userName} onChange={e=>setUserName(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
