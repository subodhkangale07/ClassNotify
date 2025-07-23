const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type : { type: String , require : true , enum :[ "lab" , "lecture" ]}
});

module.exports = mongoose.model('Class', classSchema);