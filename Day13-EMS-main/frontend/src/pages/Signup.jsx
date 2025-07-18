import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', userName: '', email: '', password: '', role: 'USER' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        name: form.name,
        userName: form.userName,
        email: form.email,
        password: form.password,
        roleNames: [form.role],
      });
      alert('Registered successfully, please log in');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Username:</label>
        <input name="userName" value={form.userName} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <label>User Role:</label>
        <div>
          <label><input type="radio" value="USER" name="role" checked={form.role==='USER'} onChange={handleChange} /> User</label>
          <label><input type="radio" value="ADMIN" name="role" checked={form.role==='ADMIN'} onChange={handleChange} /> Admin</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
