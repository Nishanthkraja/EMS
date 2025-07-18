import React, { useState } from 'react';

function AddStudentForm({ onStudentAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    subjects: [],
    grade: ''
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubjectAdd = () => {
    if (!subjectInput.trim()) return;
    
    const subjectNames = subjectInput.split(',').map(s => s.trim()).filter(s => s);
    const newSubjects = subjectNames.map(name => ({
      name,
      grade: 0
    }));
    
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, ...newSubjects]
    }));
    setSubjectInput('');
  };

  const handleSubjectRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubjectGradeChange = (index, grade) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? { ...subject, grade: Number(grade) } : subject
      )
    }));
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!formData.rollNumber) {
      setError('Roll number is required');
      return false;
    }
    if (!formData.class) {
      setError('Class is required');
      return false;
    }
    if (!formData.section) {
      setError('Section is required');
      return false;
    }
    if (!formData.grade || isNaN(formData.grade) || formData.grade < 0 || formData.grade > 100) {
      setError('Overall grade must be between 0 and 100');
      return false;
    }
    if (formData.subjects.length === 0) {
      setError('At least one subject is required');
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
      const response = await fetch('http://localhost:5002/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          grade: Number(formData.grade)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student');
      }

      onStudentAdd(data);
      // Reset form
      setFormData({
        name: '',
        rollNumber: '',
        class: '',
        section: '',
        subjects: [],
        grade: ''
      });
      setSubjectInput('');
      setError('');
    } catch (err) {
      setError(err.message || 'Error adding student. Please try again.');
      console.error('Error adding student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-student-form">
      <h2>Add New Student</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Student Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter student name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="rollNumber">Roll Number</label>
        <input
          type="text"
          id="rollNumber"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          placeholder="Enter roll number"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="class">Class</label>
        <input
          type="text"
          id="class"
          name="class"
          value={formData.class}
          onChange={handleChange}
          placeholder="Enter class (e.g., 10)"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="section">Section</label>
        <input
          type="text"
          id="section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          placeholder="Enter section (e.g., A)"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="subjects">Subjects</label>
        <div className="subject-input-group">
          <input
            type="text"
            id="subjects"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Enter subject names (e.g., Math, Science, English)"
          />
          <button 
            type="button" 
            onClick={handleSubjectAdd}
            className="add-subject-btn"
          >
            Add Subject
          </button>
        </div>
        
        <div className="subjects-list">
          {formData.subjects.length > 0 ? (
            <>
              <div className="subjects-list-header">
                <span>Subject Name</span>
                <span>Grade</span>
                <span></span>
              </div>
              {formData.subjects.map((subject, index) => (
                <div key={index} className="subject-item">
                  <span>{subject.name}</span>
                  <input
                    type="number"
                    value={subject.grade}
                    onChange={(e) => handleSubjectGradeChange(index, e.target.value)}
                    placeholder="Grade"
                    min="0"
                    max="100"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubjectRemove(index)}
                    className="remove-subject-btn"
                    title="Remove subject"
                  >
                    ×
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="subjects-empty-state">
              No subjects added yet. Add subjects using the input field above.
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="grade">Overall Grade</label>
        <input
          type="number"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Enter overall grade (0-100)"
          min="0"
          max="100"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={loading ? 'loading' : ''}
      >
        {loading ? 'Adding Student...' : 'Add Student'}
      </button>
    </form>
  );
}

export default AddStudentForm;
