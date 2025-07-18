const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Helper function to build filter query
const buildFilterQuery = (queryParams) => {
    const query = {};
    
    if (queryParams.name) {
        query.name = { $regex: queryParams.name, $options: 'i' };
    }
    
    if (queryParams.minGrade || queryParams.maxGrade) {
        query.grade = {};
        if (queryParams.minGrade) query.grade.$gte = Number(queryParams.minGrade);
        if (queryParams.maxGrade) query.grade.$lte = Number(queryParams.maxGrade);
    }
    
    if (queryParams.class) {
        query.class = queryParams.class;
    }
    
    if (queryParams.section) {
        query.section = queryParams.section;
    }
    
    if (queryParams.status) {
        query.status = queryParams.status;
    }
    
    if (queryParams.minAttendance) {
        query.attendance = { $gte: Number(queryParams.minAttendance) };
    }

    return query;
};

// Get all students with filtering, sorting, and pagination
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
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        
        const skip = (Number(page) - 1) * Number(limit);
        
        // Execute main query with pagination
        const students = await Student.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));
        
        // Get total count for pagination
        const total = await Student.countDocuments(query);
        
        // Calculate pagination info
        const totalPages = Math.ceil(total / Number(limit));
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
        
        res.json({
            students,
            pagination: {
                total,
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

// Get student by ID with detailed info
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        // Calculate average grade
        const averageGrade = student.calculateAverageGrade();
        
        // Add calculated fields to response
        const studentResponse = student.toObject();
        studentResponse.averageGrade = averageGrade;
        
        res.json(studentResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new student
router.post('/', async (req, res) => {
    const student = new Student({
        name: req.body.name,
        grade: req.body.grade,
        rollNumber: req.body.rollNumber,
        class: req.body.class,
        section: req.body.section,
        subjects: req.body.subjects || [],
        attendance: req.body.attendance,
        status: req.body.status || 'active'
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update student
router.patch('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update only provided fields
        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== '__v') {
                student[key] = updates[key];
            }
        });

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        await student.remove();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get class statistics
router.get('/stats/class/:className', async (req, res) => {
    try {
        const className = req.params.className;
        const stats = await Student.aggregate([
            { $match: { class: className, status: 'active' } },
            {
                $group: {
                    _id: '$section',
                    averageGrade: { $avg: '$grade' },
                    maxGrade: { $max: '$grade' },
                    minGrade: { $min: '$grade' },
                    studentCount: { $sum: 1 },
                    averageAttendance: { $avg: '$attendance' }
                }
            }
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
