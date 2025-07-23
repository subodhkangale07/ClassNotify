const mongoose = require("mongoose");


// Schema for individual time slots
const SlotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  subject_code: { type: String },

  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  room: { type: String },
  type : { type : String , require : false ,   enum : [ 'lab' ,'lecture' ]},
  id:{type:String},
  day:{type:String}
});

// Schema for daily schedules

const DaySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: { type: [SlotSchema], required: true }
});

// Schema for each schedule type (lab or lecture)
const ScheduleTypeSchema = new mongoose.Schema({
  phase: { type: String }, // Only for labs (e.g., "10 TO 12")
  days: { type: [DaySchema], required: true }
});

const CombinedClassScheduleSchema = new mongoose.Schema({
  class: { type: String, required: true },
  effective_date: { type: String, required: true },
  lectures: { type: ScheduleTypeSchema },
  labs: { type: ScheduleTypeSchema },
  createdAt:{type:Date,default:Date.now}
});


const CombinedClassSchedule = mongoose.model("CombinedClassSchedule", CombinedClassScheduleSchema);


CombinedClassScheduleSchema.index({ class: 1 }, { unique: true });


module.exports = CombinedClassSchedule;