import React, { useState } from 'react';

function AddEmployeeForm({ onEmployeeAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    employeeId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!formData.position) {
      setError('Position is required');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.salary || isNaN(formData.salary) || formData.salary <= 0) {
      setError('Salary must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5002/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add employee');
      }

      onEmployeeAdd(data);
      setFormData({
        name: '',
        position: '',
        department: '',
        salary: '',
        employeeId: ''
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Error adding employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-employee-form">
      <h2>Add New Employee</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Employee Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter employee name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="position">Position</label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Enter position"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Enter department"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="salary">Salary</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Enter salary"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="employeeId">Employee ID (Optional)</label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="Enter employee ID"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={loading ? 'loading' : ''}
      >
        {loading ? 'Adding Employee...' : 'Add Employee'}
      </button>
    </form>
  );
}

export default AddEmployeeForm;
