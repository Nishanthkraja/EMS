import React from "react";

const StudentCard = ({ student, onGradeChange }) => {
  const handleInputChange = (e) => {
    const newGrade = parseInt(e.target.value, 10);
    if (!isNaN(newGrade) && newGrade >= 0 && newGrade <= 100) {
      onGradeChange(student.id, newGrade);
    }
  };

  return (
    <div className="student-card">
      <h2>{student.name}</h2>
      <div className="grade-container">
        <p>Grade: {student.grade}</p>
        <input
          type="number"
          value={student.grade}
          onChange={handleInputChange}
          min="0"
          max="100"
        />
      </div>
      <div className="grade-bar">
        <div
          className="progress"
          style={{ width: `${student.grade}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StudentCard;
