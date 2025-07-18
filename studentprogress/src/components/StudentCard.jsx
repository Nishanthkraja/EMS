import React, { useState } from 'react';

function StudentCard({ student, onGradeChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newGrade, setNewGrade] = useState(student.grade);

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    onGradeChange(student._id, Number(newGrade));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      onDelete(student._id);
    }
  };

  return (
    <div className="student-card">
      <h3>{student.name}</h3>
      {isEditing ? (
        <form onSubmit={handleGradeSubmit}>
          <input
            type="number"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            min="0"
            max="100"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="grade-display">
          <p>Grade: {student.grade}</p>
          <button onClick={() => setIsEditing(true)}>Edit Grade</button>
        </div>
      )}
      <button className="delete-btn" onClick={handleDelete}>
        Delete Student
      </button>
    </div>
  );
}

export default StudentCard;
