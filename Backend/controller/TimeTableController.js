const CombinedClassSchedule = require('../models/TimeTableSchema');

// ✅ UPDATE TIMETABLE BY ID

exports.updateTimeTableById = async(req, res) => {
  try {
    console.log("Req Recived ");
    const timetableId = req.params.id;
    
    // Use req.body directly instead of req.body.mergedData
    const timetableData = req.body;

    console.log(" Id :: ", timetableId);
    console.log("TT :: ---<> ", timetableData);
    
    const updatedTimetable = await CombinedClassSchedule.findByIdAndUpdate(
      timetableId, 
      timetableData, 
      { new: true }
    );
    
    res.status(200).json({ 
      message: "Timetable updated successfully!", 
      timeTable: updatedTimetable 
    });
  }
  catch(e) {
    console.log("Error : ", e);
    return res.status(500).json({
      message: "Error updating timetable",
      error: e.message, // Only send the error message, not the full error object
    });
  }
}




exports.getTimetableById = async (req, res) => {
    try {
        const timetable = await CombinedClassSchedule.findById(req.params.id);
        if (!timetable) {
            return res.status(404).json({ error: "Timetable not found" });
        }
        res.status(200).json(timetable);
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ error: "Failed to fetch timetable." });
    }
};





// exports.getInstructorTimetable = async (req, res) => {
//     try {
//         const { name } = req.params; // Instructor ka name (nickname)

//         // 1️⃣ Pure timetable fetch karo
//         const schedules = await ClassSchedule.find({});

//         // 2️⃣ Sirf us instructor ke slots filter karo
//         let instructorTimetable = [];

//         schedules.forEach((schedule) => {
//             let filteredDays = [];

//             schedule.days.forEach((day) => {
//                 let filteredSlots = day.slots.filter((slot) => slot.professor === name);

//                 if (filteredSlots.length > 0) {
//                     filteredDays.push({
//                         day: day.day,
//                         slots: filteredSlots.sort((a, b) => a.time.localeCompare(b.time)) // 🕒 Time-wise sorting
//                     });
//                 }
//             });

//             if (filteredDays.length > 0) {
//                 instructorTimetable.push({
//                     class: schedule.class,
//                     // effective_date: schedule.effective_date,
//                     days: filteredDays
//                 });
//             }
//         });

//         if (instructorTimetable.length === 0) {
//             return res.status(404).json({ message: "Timetable not found for this instructor" });
//         }

//         res.status(200).json({ timetable: instructorTimetable });
//     } catch (error) {
//         console.error("Error fetching instructor timetable:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };







// Controller functions for handling timetable operations



exports.createOrUpdateTimetable = async (req, res) => {
  try {

    console.log("Hello ");
    // Validate required fields
    if (!req.body.class || !req.body.effective_date) {
      return res.status(400).json({ error: "Missing required fields: class or effective_date" });
    }

    // Determine if this is a lab or lecture timetable
    const isLab = !!req.body.phase;
    const scheduleType = isLab ? 'labs' : 'lectures';

    // Format the data for the specific schedule type
    const scheduleData = {
      days: req.body.days
    };

    console.log(scheduleData);

    // Add phase if it's a lab schedule
    if (isLab) {
      scheduleData.phase = req.body.phase;
    }

    // Look for an existing document for this class
    const existingSchedule = await CombinedClassSchedule.findOne({
      class: req.body.class
    });

    if (existingSchedule) {
      // Update the existing document with the new schedule data
      existingSchedule[scheduleType] = scheduleData;
      await existingSchedule.save();

      res.status(200).json({
        message: `${isLab ? 'Lab' : 'Lecture'} timetable updated successfully!`,
        data: existingSchedule
      });
    } else {
      // Create a new document with the initial schedule data
      const newScheduleDoc = {
        class: req.body.class,
        effective_date: req.body.effective_date
      };

      // Add the schedule data to the appropriate field
      newScheduleDoc[scheduleType] = scheduleData;

      const newCombinedSchedule = new CombinedClassSchedule(newScheduleDoc);
      await newCombinedSchedule.save();

      res.status(201).json({
        message: `New timetable with ${isLab ? 'lab' : 'lecture'} schedule created successfully!`,
        data: newCombinedSchedule
      });
    }
  } catch (error) {
    console.error("Error saving timetable:", error);
    res.status(500).json({ error: "Failed to save timetable.", details: error.message });
  }
};





// Get timetable by class
exports.getTimetableByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ error: "Class name is required" });
    }

    const timetable = await CombinedClassSchedule.findOne({ class: className });

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found for this class" });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
};

// Get all timetables

// exports.getAllTimetables = async (req, res) => {
//   try {
//     const timetables = await CombinedClassSchedule.find();
//     res.status(200).json(timetables);
//   } catch (error) {
//     console.error("Error fetching timetables:", error);
//     res.status(500).json({ error: "Failed to fetch timetables" });
//   }
// };


exports.getAllTimetables = async (req, res) => {

  try
  {
      const timetables = await CombinedClassSchedule.find();
      res.status(200).json(timetables);
  }
  catch (error)
  {
      console.error("Error fetching timetables:", error);
      res.status(500).json({ error: "Failed to fetch timetables." });
  }

};

// Delete a timetable
exports.deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Timetable ID is required" });
    }

    const result = await CombinedClassSchedule.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.status(200).json({ message: "Timetable deleted successfully" });
  } catch (error) {
    console.error("Error deleting timetable:", error);
    res.status(500).json({ error: "Failed to delete timetable" });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    // Fetch data with populated professor field
    const data = await CombinedClassSchedule.find().populate({
      path: 'lectures.days.slots.professor labs.days.slots.professor',
      model: 'User' // Assuming your UserSchema is registered as 'User' model
    });
    
    let result = [];

    data.forEach((singleTT) => {
      // Process lectures
      if (singleTT.lectures && singleTT.lectures.days) {
        singleTT.lectures.days.forEach((day) => {
          if (day.slots) {
            day.slots.forEach((slot) => {
              // Add class and day information to each slot for better context
              const enhancedSlot = {
                ...slot.toObject(),
                class: singleTT.class,
                scheduleType: 'lecture'
              };
              result.push(enhancedSlot);
            });
          }
        });
      }
   
      
      // Process labs as well
      if (singleTT.labs && singleTT.labs.days) {
        singleTT.labs.days.forEach((day) => {
          if (day.slots) {
            day.slots.forEach((slot) => {
              // Add class and day information to each slot for better context
              const enhancedSlot = {
                ...slot.toObject(),
                class: singleTT.class,
                scheduleType: 'lab',
                phase: singleTT.labs.phase
              };
              result.push(enhancedSlot);
            });
          }
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Fetched All The Slots Successfully!!",
      result,
    });
  } catch (error) {
    console.error("Error fetching timetable slots:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetable slots.",
      error: error.message,
    });
  }
};