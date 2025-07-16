import React, { useState } from 'react';

function EmployeeCard({ employee, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState({ ...employee });

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(employee._id, updatedEmployee);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDelete(employee._id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="employee-card">
      <h3>{employee.name}</h3>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={updatedEmployee.position}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={updatedEmployee.department}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={updatedEmployee.salary}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="employee-details">
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
      <button className="delete-btn" onClick={handleDelete}>
        Delete Employee
      </button>
    </div>
  );
}

export default EmployeeCard;
