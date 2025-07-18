require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

const sampleStudents = [
    {
        name: "John Doe",
        grade: 85,
        rollNumber: "2023001",
        class: "10A",
        section: "A",
        subjects: [
            { name: "Math", grade: 90 },
            { name: "Science", grade: 85 },
            { name: "English", grade: 80 }
        ],
        attendance: 95,
        status: "active"
    },
    {
        name: "Jane Smith",
        grade: 92,
        rollNumber: "2023002",
        class: "10A",
        section: "A",
        subjects: [
            { name: "Math", grade: 95 },
            { name: "Science", grade: 92 },
            { name: "English", grade: 89 }
        ],
        attendance: 98,
        status: "active"
    },
    {
        name: "Bob Wilson",
        grade: 78,
        rollNumber: "2023003",
        class: "10B",
        section: "B",
        subjects: [
            { name: "Math", grade: 75 },
            { name: "Science", grade: 80 },
            { name: "English", grade: 79 }
        ],
        attendance: 88,
        status: "active"
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Student.deleteMany({});
        console.log('Cleared existing students');

        // Insert sample data
        const result = await Student.insertMany(sampleStudents);
        console.log(`Added ${result.length} sample students`);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
