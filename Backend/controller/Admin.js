const Class = require('../models/Class');
const Subject = require('../models/Subject');
const bcrypt = require('bcryptjs');

const User = require('../models/UserSchema');


// CLASS CONTROLERS

exports.addClass = async (req, res) => {
    try {

        // Check if the user is an admin
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { name, type } = req.body;

        // Ensure both name and type are provided

        // console.log(name  , type );


        if (!name || !type) return res.status(400).json({ message: 'Class name and type are required' });

        // Validate the type to be either "lab" or "lecture"
        if (!['lab', 'lecture'].includes(type)) {
            return res.status(400).json({ message: 'Invalid class type. Must be "lab" or "lecture"' });
        }

        // Check if the class already exists
        const existingClass = await Class.findOne({ name });

        if (existingClass) return res.status(400).json({ message: 'Class already exists' });

        // Create and save the new class
        const newClass = new Class({ name, type });
        await newClass.save();

        res.status(201).json({ message: 'Class added successfully', newClass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeClass = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { name } = req.body;

        // Remove the class by name
        const removedClass = await Class.findOneAndDelete({ name });

        if (!removedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json({ message: 'Class removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllClass = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Retrieve all classes
        const allClass = await Class.find({});

        console.log(allClass);

        res.json({ message: 'Classes retrieved successfully', data: allClass });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// SUBJECT CONTROLLER


exports.addSubject = async (req, res) => {
    try {
        console.log("User Info from Token:", req.user);

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { name, type, year } = req.body;
        if (!name) return res.status(400).json({ message: 'Subject name is required' });
        if (!type) return res.status(400).json({ message: 'Subject type is required' });
        if (!year) return res.status(400).json({ message: 'Subject year is required' });
        if (!['lab', 'lecture'].includes(type)) return res.status(400).json({ message: 'Subject type must be either "lab" or "lecture"' });
        if (!['FY', 'SY', 'TY', 'LY'].includes(year)) return res.status(400).json({ message: 'Subject year must be either "FY", "SY", "TY", or "LY"' });

        // Check if subject already exists with the same name and year
        const existingSubject = await Subject.findOne({ name, year });
        if (existingSubject) return res.status(400).json({ message: 'Subject already exists for this year' });

        const newSubject = new Subject({ name, type, year });
        await newSubject.save();

        res.status(201).json({ message: 'Subject added successfully', newSubject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeSubject = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { id } = req.body;

        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(400).json({ message: 'Subject does not exist' });
        }

        await Subject.findByIdAndDelete(id);

        res.json({ message: 'Subject removed successfully' ,success:true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSubject = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        const allSubject = await Subject.find({});

        // console.log(allSubject);

        res.json({ message: 'Subjects retrieved successfully', data: allSubject });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// USER ROUTERS


exports.addUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { name, emailId, password, mobileNumber } = req.body;
        if (!name  || !emailId || !password || !mobileNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ emailId });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            emailId,
            password: hashedPassword,
            role: 'user',
            mobileNumber
        });

        await newUser.save();
        return res.status(201).json({ message: 'User added successfully', user: newUser });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { emailId } = req.body;
        if (!emailId) return res.status(400).json({ message: 'Email ID is required' });

        const deletedUser = await User.findOneAndDelete({ emailId, role: 'user' });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        return res.json({ message: 'User deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        // Fetch users with role 'user' only
        const allUsers = await User.find({ role: 'user' });

        if (!allUsers.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        return res.json({ users: allUsers });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



exports.updateUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { emailId, name, nickname, mobileNumber } = req.body;
        if (!emailId) return res.status(400).json({ message: 'Email ID is required' });

        const updatedUser = await User.findOneAndUpdate(
            { emailId, role: 'user' },
            { name, nickname, mobileNumber },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User updated successfully', updatedUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};