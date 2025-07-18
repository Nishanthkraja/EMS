import { Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../utils/auth';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="brand">Employee Management System</span>
      <div className="links">
        {!token && <Link to="/signup">Sign Up</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && <button onClick={logout}>Logout</button>}
      </div>
    </nav>0
  );
}
