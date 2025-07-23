const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    nickname: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    mobileNumber: { type: String }

});


const User = mongoose.model('User', userSchema);
module.exports = User;
