const User = require('../models/UserSchema');
const CombinedClassSchedule = require('../models/TimeTableSchema');

exports.getDayWiseTimeTable = async (req, res) => {
  try {
    const { professorId, day } = req.body;

    if (!professorId || !day) {
      return res.status(400).json({
        success: false,
        message: "Both professorId and day are required"
      });
    }

    const professorExists = await User.findById(professorId);
    if (!professorExists) {
      return res.status(404).json({
        success: false,
        message: "Professor not found"
      });
    }

    const allTimetables = await CombinedClassSchedule.find();

    const lectureSlots = [];
    const labSlots = [];

    allTimetables.forEach(timetable => {
      if (timetable.lectures && timetable.lectures.days) {
        const daySchedule = timetable.lectures.days.find(d => d.day.toLowerCase() === day.toLowerCase());
        
        if (daySchedule) {
          const matchingSlots = daySchedule.slots.filter(slot =>
            slot.professor && slot.professor.toString() === professorId
          );

          if (matchingSlots.length > 0) {
            matchingSlots.forEach(slot => {
              const slotInfo = {
                class: timetable.class,
                effective_date: timetable.effective_date,
                time: slot.time,
                subject_code: slot.subject_code,
                room: slot.room,
                slotId: slot.id
              };

              if (slot.type && slot.type.toLowerCase() === 'lab') {
                if (timetable.lectures.phase) {
                  slotInfo.phase = timetable.lectures.phase;
                }
                slotInfo.type = 'lab';
                labSlots.push(slotInfo);
              } else {
                slotInfo.type = 'lecture';
                lectureSlots.push(slotInfo);
              }
            });
          }
        }
      }
    });

    const sortByTime = (a, b) => {
      const getHours = timeString => {
        const match = timeString.match(/^(\d+)[:.](\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      return getHours(a.time) - getHours(b.time);
    };

    lectureSlots.sort(sortByTime);
    labSlots.sort(sortByTime);

    return res.status(200).json({
      success: true,
      data: {
        professorId,
        day,
        schedule: {
          lectures: lectureSlots,
          labs: labSlots
        }
      }
    });

  } catch (error) {
    console.error("Error fetching professor timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
      error: error.message
    });
  }
};