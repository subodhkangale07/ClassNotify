const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const signup = async (req, res) => {
    try {
        const { name, emailId, password, role, mobileNumber, nickname } = req.body;

        if (!name || !emailId || !password || !role || !mobileNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ emailId });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            emailId,
            password: hashedPassword,
            role,
            mobileNumber,
            nickname
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "NOT ENTRY CREATED" });
    }
};



const login = async (req, res) => {
    try {

        const { emailId, password , role  } = req.body;

        console.log("Login attempt with:", emailId , role ); 

        const user = await User.findOne({ emailId });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

        console.log("Generated Token:", token); // Debugging log

        res.status(200).json({ token, user });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = { signup, login };
