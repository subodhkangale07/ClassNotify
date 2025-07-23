import React, { useState, useRef, useEffect } from "react";
import ItemSelectionPanel from "../components/ItemSelectionPanel";
import Timetable from "../components/Timetable";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/constants";

// const BASE_URL = 'http://localhost:5000/api/v1';
const URL = `${BASE_URL}/tt/create`;
const GET_SUBJECTS_API = `${BASE_URL}/subject/getAllSubject`;
const GET_PROFESSORS_API = `${BASE_URL}/user/getAllUser`;
const GET_CLASSROOMS_API = `${BASE_URL}/class/getAllClass`;

const CreateCombinedTimetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const lectureTimes = [
    { id: "8-9", display: "8:00 AM - 9:00 AM", isStatic: false },
    { id: "9-10", display: "9:00 AM - 10:00 AM", isStatic: false },
    { id: "10:15-11:15", display: "10:15 AM - 11:15 AM", isStatic: false },
    { id: "11:15-12:15", display: "11:15 AM - 12:15 PM", isStatic: false },
    { id: "12:15-1:15", display: "12:15 PM - 1:15 PM", isStatic: true, name: "Lunch Break" },
    { id: "1:15-2:15", display: "1:15 PM - 2:15 PM", isStatic: false },
    { id: "2:15-3:15", display: "2:15 PM - 3:15 PM", isStatic: false },
    { id: "3:15-3:30", display: "3:15 PM - 3:30 PM", isStatic: true, name: "Tea Break" },
    { id: "3:30-4:30", display: "3:30 PM - 4:30 PM", isStatic: false },
    { id: "4:30-5:30", display: "4:30 PM - 5:30 PM", isStatic: false },
  ];
  const labTimes = [
    { id: "Batch-1", display: "Batch 1" },
    { id: "Batch-2", display: "Batch 2" },
    { id: "Batch-3", display: "Batch 3" },
    { id: "Batch-4", display: "Batch 4" },
    { id: "Batch-5", display: "Batch 5" },
    { id: "Batch-6", display: "Batch 6" },
    { id: "Batch-7", display: "Batch 7" },
    { id: "Batch-8", display: "Batch 8" },
    { id: "Batch-9", display: "Batch 9" },
    { id: "Batch-10", display: "Batch 10" },
    { id: "Batch-11", display: "Batch 11" },
    { id: "Batch-12", display: "Batch 12" },
  ];
  const classOptions = [
    
    { id: 1, name: "First-Year (FY)" },
    { id: 2, name: "Second-Year (SY)" },
    { id: 3, name: "Third-Year (TY)" },
    { id: 4, name: "Fourth-Year (LY)" }
  ];
  const labTimeOptions = [
    { id: 1, name: "10:15 AM - 12:15 PM" },
    { id: 2, name: "1:15 PM - 3:15 PM" },
    { id: 3, name: "3:30 PM - 5:30 PM" }
  ];
  const [activeScheduleType, setActiveScheduleType] = useState("lecture");
  const [selectedClass, setSelectedClass] = useState(classOptions[0].name);
  const [selectedLabPhase, setSelectedLabPhase] = useState(labTimeOptions[0].name);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [labSubjects, setLabSubjects] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [labProfessors, setLabProfessors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [labClassrooms, setLabClassrooms] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [lectureSchedule, setLectureSchedule] = useState([]);
  const [labSchedule, setLabSchedule] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("subjects");
  const printRef = useRef();

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    return token;
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSubjects(),
          fetchProfessors(),
          fetchClassrooms()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const lectureData = formatLectureDataForExcel();
    const lectureWs = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(lectureWs, lectureData);
    applyWrapTextToSheet(lectureWs);
    lectureWs['!cols'] = [{ wch: 15 }, ...Array(6).fill({ wch: 25 })];
    XLSX.utils.book_append_sheet(wb, lectureWs, "Lecture Schedule");
    if (labSchedule.length > 0) {
      const labData = formatLabDataForExcel();
      const labWs = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(labWs, labData);
      applyWrapTextToSheet(labWs);
      labWs['!cols'] = [{ wch: 15 }, ...Array(6).fill({ wch: 25 })];
      XLSX.utils.book_append_sheet(wb, labWs, "Lab Schedule");
    }
    const fileName = `${selectedClass.replace(/[()]/g, "")}_Timetable_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const applyWrapTextToSheet = (ws) => {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = 1; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell && cell.v) {
          if (!cell.s) cell.s = {};
          cell.s.alignment = { wrapText: true };
        }
      }
    }
  };

  const formatLectureDataForExcel = () => {
    const result = [];
    const header = ["Time Slot", ...days];
    result.push(header);
    lectureTimes.forEach((timeSlot) => {
      const row = [timeSlot.display];
      days.forEach((day) => {
        const cellKey = `${timeSlot.id}-${day}`;
        const entry = lectureSchedule.find((slot) => slot.id === cellKey);
        if (entry) {
          const cellContent = [
            entry.subject_code || "",
            entry.professor_name ? `Prof: ${entry.professor_name}` : "",
            entry.room ? `Room: ${entry.room}` : ""
          ]
            .filter(Boolean)
            .join("\r\n"); // Use \r\n for Excel line breaks
          row.push({ v: cellContent, t: "s", s: { alignment: { wrapText: true } } });
        } else {
          row.push(""); // Empty cell
        }
      });
      result.push(row);
    });
    return result;
  };

  const formatLabDataForExcel = () => {
    const result = [];
    const header = ["Time Slot", ...days];
    result.push(header);
    labTimes.forEach((timeSlot) => {
      const row = [timeSlot.display];
      days.forEach((day) => {
        const cellKey = `${timeSlot.id}-${day}`;
        const entry = labSchedule.find((slot) => slot.id === cellKey);
        if (entry) {
          row.push(`🧪 ${entry.subject_code}\nProf: ${entry.professor_name}\nRoom: ${entry.room}`);
        } else {
          row.push("");
        }
      });
      result.push(row);
    });
  
    return result;
  };

  const fetchSubjects = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_SUBJECTS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const allSubjectsData = response.data?.data || [];
      setAllSubjects(allSubjectsData);
      filterSubjectsByYear(allSubjectsData, selectedClass);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      handleAuthError(error);
    }
  };

  const filterSubjectsByYear = (allSubjectsData, yearClass) => {
    let yearPrefix;
    if (yearClass.includes("Second-Year")) {
      yearPrefix = "SY";
    } else if (yearClass.includes("Third-Year")) {
      yearPrefix = "TY";
    } else if (yearClass.includes("Fourth-Year")) {
      yearPrefix = "LY";
    } else if (yearClass.includes("First-Year")) {
      yearPrefix = "FY";
    } else {
      yearPrefix = "SY"; // Default to SY if no match
    }
    const yearFilteredSubjects = allSubjectsData.filter(subject =>
      subject.year === yearPrefix
    );
    const subjectsToUse = yearFilteredSubjects.length > 0 ? yearFilteredSubjects : allSubjectsData;
    const lectureSubjects = subjectsToUse
      .filter(subject => subject.type === 'lecture')
      .map((subject, index) => ({
        id: index + 1,
        name: subject.name,
        _id: subject._id,
        year: subject.year // Store the year from the model
      }));
    const labSubjectsList = subjectsToUse
      .filter(subject => subject.type === 'lab')
      .map((subject, index) => ({
        id: index + 1,
        name: subject.name,
        _id: subject._id,
        year: subject.year // Store the year from the model
      }));
    setSubjects(lectureSubjects);
    setLabSubjects(labSubjectsList);
  };

  const fetchProfessors = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_PROFESSORS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const allProfessors = response.data?.users || [];
      const formattedProfessors = allProfessors.map((professor, index) => {
        let fullName;
        if (professor.name) {
          fullName = professor.name;
        } else if (professor.firstName && professor.lastName) {
          fullName = `${professor.firstName} ${professor.lastName}`;
        } else if (professor.fullName) {
          fullName = professor.fullName;
        } else {
          fullName = `Professor ${index + 1}`; // Fallback
        }
        return {
          id: index + 1,
          name: fullName,
          _id: professor._id
        };
      });
      setProfessors(formattedProfessors);
      setLabProfessors(formattedProfessors);
    } catch (error) {
      console.error("Error fetching professors:", error);
      handleAuthError(error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_CLASSROOMS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const allClassrooms = response.data?.data || [];
      const classroomTypes = [...new Set(allClassrooms.map(c => c.type))];
      const lectureClassrooms = allClassrooms.map((classroom, index) => ({
        id: index + 1,
        name: classroom.name,
        _id: classroom._id,
        type: classroom.type 
      }));

      const filteredLectureClassrooms = allClassrooms
        .filter(classroom => classroom.type === 'lecture')
        .map((classroom, index) => ({
          id: index + 1,
          name: classroom.name,
          _id: classroom._id
        }));

      const filteredLabClassrooms = allClassrooms
        .filter(classroom => classroom.type === 'lab')
        .map((classroom, index) => ({
          id: index + 1,
          name: classroom.name,
          _id: classroom._id
        }));
      if (filteredLectureClassrooms.length === 0 && filteredLabClassrooms.length === 0) {
        setClassrooms(lectureClassrooms);
        setLabClassrooms(lectureClassrooms);
      } else {
        setClassrooms(filteredLectureClassrooms.length > 0 ?
          filteredLectureClassrooms : lectureClassrooms);
        setLabClassrooms(filteredLabClassrooms.length > 0 ?
          filteredLabClassrooms : lectureClassrooms);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      handleAuthError(error);
    }
  };

  const getCurrentSchedule = () => {
    return activeScheduleType === "lecture" ? lectureSchedule : labSchedule;
  };

  const setCurrentSchedule = (schedule) => {
    if (activeScheduleType === "lecture") {
      setLectureSchedule(schedule);
    } else {
      setLabSchedule(schedule);
    }
  };

  const handleClassChange = (e) => {
    const newSelectedClass = e.target.value;
    setSelectedClass(newSelectedClass);
    filterSubjectsByYear(allSubjects, newSelectedClass);
    
    // Reset both lecture and lab schedules when class changes
    setLectureSchedule([]);
    setLabSchedule([]);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedItem(null); // Reset selected item when changing tabs
  };

  const handleLabPhaseChange = (e) => {
    setSelectedLabPhase(e.target.value);
  };

  const handleScheduleTypeChange = (type) => {
    if (type === activeScheduleType) return;
    setActiveScheduleType(type);
    setSelectedItem(null);
  };

  const getProfessorNameById = (professorId) => {
    const allProfessors = [...professors, ...labProfessors];
    const professorById = allProfessors.find(prof => prof.id === professorId || prof._id === professorId);
    if (professorById) return professorById.name;
    const professorByStringId = allProfessors.find(prof =>
      String(prof.id) === String(professorId) || String(prof._id) === String(professorId)
    );
    if (professorByStringId) return professorByStringId.name;
    return professorId;
  };

  const handleCellClick = (timeSlot, day) => {
    if (timeSlot.isStatic) return;
    if (!selectedItem) return;
    const cellKey = `${timeSlot.id}-${day}`;
    const currentSchedule = getCurrentSchedule();
    let updated = false;
    const updatedSchedule = currentSchedule.map(slot => {
      if (slot.id === cellKey) {
        updated = true;
        if (activeTab === "professors") {
          return {
            ...slot,
            professor: selectedItem._id,        // Store ID for database
            professor_name: selectedItem.name   // Store name for display
          };
        }
        else if (activeTab === "subjects") {
          return {
            ...slot,
            subject_code: selectedItem.name     // Store name for database and display
          };
        } else { 
          return {
            ...slot,
            room: selectedItem.name           
          };
        }
      }
      return slot;
    });

    if (!updated) {
      let newSlot = {
        id: cellKey,
        day: day,
        type: activeScheduleType
      };

      if (activeScheduleType === "lab") {
        newSlot.time = selectedLabPhase;  // Use the selected lab time option
        newSlot.batch = timeSlot.id;      // Store batch ID separately
      } else {
        newSlot.time = timeSlot.display;  // For lecture, use the display time
      }

      if (activeTab === "professors") {
        newSlot.professor = selectedItem._id;        // Store ID for database
        newSlot.professor_name = selectedItem.name;  // Store name for display
      }
      else if (activeTab === "subjects") {
        newSlot.subject_code = selectedItem.name;    // Store name for database and display
      } else { // classrooms
        newSlot.room = selectedItem.name;            // Store name for database and display
      }

      updatedSchedule.push(newSlot);
    }
    setCurrentSchedule(updatedSchedule);
  };

  const handleDelete = (timeSlot, day) => {
    const cellKey = `${timeSlot.id}-${day}`;
    const currentSchedule = getCurrentSchedule();
    setCurrentSchedule(currentSchedule.filter(slot => slot.id !== cellKey));
  };

  const handleItemClick = (item, type) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      _id: item._id, // Add this line to include the MongoDB ID
      type
    });
  };

  const handleZoomChange = (newZoomLevel) => {
    setZoomLevel(Math.max(50, Math.min(150, newZoomLevel)));
  };

  const handleGoBack = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  const handleMergedSubmit = async () => {
    try {
      const lectureDaysData = [];
      days.forEach((day) => {
        const scheduleForDay = lectureSchedule.filter((slot) => slot.day === day);
        if (scheduleForDay.length > 0) {
          lectureDaysData.push({
            day: day,
            slots: scheduleForDay
          });
        }
      });
      const labDaysData = [];
      days.forEach((day) => {
        const scheduleForDay = labSchedule.filter((slot) => slot.day === day);
        if (scheduleForDay.length > 0) {
          labDaysData.push({
            day: day,
            slots: scheduleForDay
          });
        }
      });
      const mergedDays = [];
      days.forEach(day => {
        const lectureDay = lectureDaysData.find(d => d.day === day);
        const labDay = labDaysData.find(d => d.day === day);
        if (!lectureDay && !labDay) return;
        const mergedDay = { day: day, slots: [] };
        if (lectureDay && lectureDay.slots) {
          mergedDay.slots = [...mergedDay.slots, ...lectureDay.slots];
        }
        if (labDay && labDay.slots) {
          const labSlotsWithPhase = labDay.slots.map(slot => ({
            ...slot,
            time: selectedLabPhase
          }));
          mergedDay.slots = [...mergedDay.slots, ...labSlotsWithPhase];
        }
        mergedDays.push(mergedDay);
      });

      console.log(" Logging The TimeTable :: ",mergedDays);
      const mergedData = {
        class: selectedClass,
        effective_date: "2024-09-16", // remove hard Cdode  
        days: mergedDays
      };

      // Submit to API with authentication
      const token = getAuthToken();
      const response = await axios.post(URL, mergedData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // console.log("Success:", response.data);
      toast.success("Timetable saved successfully!");

    } catch (error) {
      // console.error("Error in handleMergedSubmit:", error);
      toast.error("Error saving timetable , try again later !! ");
      handleAuthError(error);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 p-4 pt-4">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-md">
        {/* Header with back button and title */}
        <div className="p-4 border-b flex items-center">
          <button 
            onClick={handleGoBack}
            className="mr-4 text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-indigo-600">Create Timetable</h1>
        </div>
        
        <div className="flex">
          {/* Left panel for controls and selection */}
          <div className="w-1/4 min-w-[320px] border-r p-4">
            <div className="mb-6">
              <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
                Class:
              </label>
              <select
                id="class-select"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 bg-white border mb-4"
                value={selectedClass}
                onChange={handleClassChange}
              >
                {classOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  className={`flex-1 px-3 py-2 text-sm rounded-md ${activeScheduleType === "lecture" ? "bg-indigo-600 text-white" : "bg-transparent text-gray-700"}`}
                  onClick={() => handleScheduleTypeChange("lecture")}
                >
                  Lecture
                </button>
                <button
                  className={`flex-1 px-3 py-2 text-sm rounded-md ${activeScheduleType === "lab" ? "bg-indigo-600 text-white" : "bg-transparent text-gray-700"}`}
                  onClick={() => handleScheduleTypeChange("lab")}
                >
                  Lab
                </button>
              </div>
              
              {activeScheduleType === "lab" && (
                <div className="mb-4">
                  <label htmlFor="phase-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Lab Session:
                  </label>
                  <select
                    id="phase-select"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 bg-white border"
                    value={selectedLabPhase}
                    onChange={handleLabPhaseChange}
                  >
                    {labTimeOptions.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              
            </div>
            
            {!loading && (
              <ItemSelectionPanel
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                subjects={activeScheduleType === "lecture" ? subjects : labSubjects}
                professors={activeScheduleType === "lecture" ? professors : labProfessors}
                classrooms={activeScheduleType === "lecture" ? classrooms : labClassrooms}
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                zoomLevel={zoomLevel}
                handleZoomChange={handleZoomChange}
              />
            )}
            <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleMergedSubmit}
                  className="w-full py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm"
                >
                  Save Timetable
                </button>
                <button
                  onClick={exportToExcel}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FaDownload size={14} />
                  <span>Export to Excel</span>
                </button>
              </div>
          </div>
          
          {/* Right panel for timetable */}
          <div className="w-3/4 p-4">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-xl text-gray-600">Loading data, please wait...</div>
              </div>
            ) : (
              <Timetable
                printRef={printRef}
                days={days}
                times={activeScheduleType === "lecture" ? lectureTimes : labTimes}
                schedule={activeScheduleType === "lecture" ? lectureSchedule : labSchedule}
                selectedItem={selectedItem}
                zoomLevel={zoomLevel}
                handleCellClick={handleCellClick}
                handleDelete={handleDelete}
                selectedClass={selectedClass}
                selectedPhase={activeScheduleType === "lab" ? selectedLabPhase : null}
                getProfessorNameById={getProfessorNameById}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateCombinedTimetable;
