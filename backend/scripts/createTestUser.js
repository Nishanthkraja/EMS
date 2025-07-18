require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Create test user
        const testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'teacher'
        });

        await testUser.save();
        console.log('Test user created successfully');
        console.log('Email: test@example.com');
        console.log('Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();
