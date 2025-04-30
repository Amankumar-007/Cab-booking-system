const user = require('../models/user.model');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {
    validationResult(req).throw();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const { email, password, fullname } = req.body;

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await user.hashPassword(password);
        // Create a new user
        const newUser = new user({
            email,
            password: hashedPassword,
            fullname,
        });
        await newUser.save();
        // Generate JWT token
        const token = newUser.generateAuthToken();
        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
            },
        });
    }

    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = {
    registerUser
};