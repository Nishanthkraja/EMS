import { useEffect, useState } from 'react';
import api from '../api';

export default function Home() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employee');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="home">
      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.empId}>{emp.name} ({emp.email})</li>
        ))}
      </ul>
    </div>
  );
}
