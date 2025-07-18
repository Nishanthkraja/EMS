import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const CreateEmployeeComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      EmployeeService.getEmployeeById(id).then((res) => {
        let employee = res.data;
        setName(employee.name);
        setEmail(employee.email);
      });
    }
  }, [id]);

  const saveOrUpdateEmployee = (e) => {
    e.preventDefault();
    let employee = { name: name, email: email };

    if (id) {
      EmployeeService.updateEmployee(employee, id).then(() => {
        navigate('/employees');
      });
    } else {
      EmployeeService.createEmployee(employee).then(() => {
        navigate('/employees');
      });
    }
  };

  const changeNameHandler = (event) => {
    setName(event.target.value);
  };

  const changeEmailHandler = (event) => {
    setEmail(event.target.value);
  };

  const cancel = () => {
    navigate('/employees');
  };

  const getTitle = () => {
    if (id) {
      return <h3 className="text-center">Update Employee</h3>;
    } else {
      return <h3 className="text-center">Add Employee</h3>;
    }
  };

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {getTitle()}
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    placeholder="Name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={changeNameHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address:</label>
                  <input
                    placeholder="Email Address"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={changeEmailHandler}
                  />
                </div>

                <button className="btn btn-success" onClick={saveOrUpdateEmployee}>
                  Save
                </button>
                <button
                  className="btn btn-danger"
                  onClick={cancel}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeComponent;
