const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Helper function to build filter query
const buildFilterQuery = (queryParams) => {
    const query = {};
    
    if (queryParams.name) {
        query.name = { $regex: queryParams.name, $options: 'i' };
    }
    
    if (queryParams.department) {
        query.department = queryParams.department;
    }
    
    if (queryParams.position) {
        query.position = queryParams.position;
    }
    
    if (queryParams.status) {
        query.status = queryParams.status;
    }

    return query;
};

// Get all employees with filtering, sorting, and pagination
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'name',
            sortOrder = 'asc',
            ...filterParams
        } = req.query;

        const query = buildFilterQuery(filterParams);
        const sortOptions = [[sortBy, sortOrder.toUpperCase()]];
        
        const skip = (Number(page) - 1) * Number(limit);
        
        const { count, rows } = await Employee.findAndCountAll({
            where: query,
            order: sortOptions,
            offset: skip,
            limit: parseInt(limit)
        });
        
        const totalPages = Math.ceil(count / Number(limit));
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
        
        res.json({
            employees: rows,
            pagination: {
                total: count,
                page: Number(page),
                totalPages,
                hasNext,
                hasPrev
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new employee
router.post('/', async (req, res) => {
    const { name, position, department, salary, employeeId, status } = req.body;

    try {
        let employee = await Employee.findOne({ where: { employeeId } });
        if (employee) {
            return res.status(400).json({ message: 'Employee with this ID already exists' });
        }

        employee = await Employee.create({
            name,
            position,
            department,
            salary,
            employeeId,
            status
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update employee
router.patch('/:id', async (req, res) => {
    try {
        const [updated] = await Employee.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const updatedEmployee = await Employee.findByPk(req.params.id);
        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Employee.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
