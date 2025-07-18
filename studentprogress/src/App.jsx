import React, { useState, useEffect } from "react";
import "./assets/styles.css";
import EmployeeCard from "./components/EmployeeCard";
import AddEmployeeForm from "./components/AddEmployeeForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

    useEffect(() => {
    if (user && token) {
      fetchEmployees();
    }
  }, [user, token]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
                throw new Error('Failed to fetch employees');
      }

            const data = await response.json();
      if (data.employees && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        console.error('Unexpected data format:', data);
        setEmployees([]);
      }
      setError(null);
    } catch (err) {
            setError(err.message);
      console.error('Error fetching employees:', err);
      setEmployees([]); // Reset to empty array on error
    }
  };

    const handleUpdate = async (id, updatedData) => {
    try {
            const response = await fetch(`http://localhost:5002/api/employees/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
                throw new Error('Failed to update employee');
      }

            const updatedEmployee = await response.json();
      setEmployees(prevEmployees => 
        prevEmployees.map(employee => 
          employee._id === id ? updatedEmployee : employee
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
            console.error('Error updating employee:', err);
    }
  };

    const handleEmployeeAdd = async (newEmployee) => {
    try {
      const response = await fetch('http://localhost:5002/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
                body: JSON.stringify(newEmployee)
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
                throw new Error('Failed to add employee');
      }

            const addedEmployee = await response.json();
      setEmployees(prevEmployees => [...prevEmployees, addedEmployee]);
      setError(null);
    } catch (err) {
      setError(err.message);
            console.error('Error adding employee:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
                throw new Error('Failed to delete employee');
      }

            setEmployees(prevEmployees => 
        prevEmployees.filter(employee => employee._id !== id)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
            console.error('Error deleting employee:', err);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setEmployees([]);
    setError(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {user ? (
          <>
            <header className="app-header">
                            <h1>Employee Management System</h1>
              <div className="user-info">
                <span>Welcome, {user.username}!</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </header>

            {error && <div className="error-message">{error}</div>}
            
                        <AddEmployeeForm onEmployeeAdd={handleEmployeeAdd} />
            
                        <div className="employee-list">
              {Array.isArray(employees) && employees.map(employee => (
                <EmployeeCard
                  key={employee._id}
                  employee={employee}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
