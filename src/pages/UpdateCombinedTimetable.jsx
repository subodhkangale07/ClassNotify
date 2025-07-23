import React, { useState, useRef, useEffect } from "react";
import ItemSelectionPanel from "../components/ItemSelectionPanel";
import Timetable from "../components/Timetable";
import AddItemModal from "../components/AddItemModal";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { BASE_URL, GET_ALL_USER_API } from "../utils/constants"
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";


// API endpoints - you'll need to define these in your constants file
// const BASE_URL = 'http://localhost:5000/api/v1';
const URL = `${BASE_URL}/tt/create`;
const GET_SUBJECTS_API = `${BASE_URL}/subject/getAllSubject`;
const GET_PROFESSORS_API = `${BASE_URL}/user/getAllUser`;
const GET_CLASSROOMS_API = `${BASE_URL}/class/getAllClass`;

const UpdateCombinedTimetable = () => {

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const location = useLocation();
  const { id } = useParams(); // Get timetable ID from URL if in update mode

  // Check if we're in update mode
  const isUpdateMode = !!id;

  // Lecture time slots
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
    { id: 1, name: "Second-Year (SY)" },
    { id: 2, name: "Third-Year (TY)" },
    { id: 3, name: "Fourth-Year (LY)" }
  ];


  const labTimeOptions = [
    { id: 1, name: " 10:15 TO 12:15" },
    { id: 2, name: " 1:15 TO  3:15" },
    { id: 3, name: " 3:30 TO  5:30" }
  ];


  const [loading, setLoading] = useState(isUpdateMode); // Start loading if in update mode
  const [activeScheduleType, setActiveScheduleType] = useState("lecture");
  const [selectedClass, setSelectedClass] = useState(classOptions[0].name);
  const [selectedLabPhase, setSelectedLabPhase] = useState(labTimeOptions[0].name);
  const [newItemName, setNewItemName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [timetableId, setTimetableId] = useState(id || null);

  // Items for panels
  const [subjects, setSubjects] = useState([]);
  const [labSubjects, setLabSubjects] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [labProfessors, setLabProfessors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [labClassrooms, setLabClassrooms] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);



  // Schedule data -> lab & lecture data all store here
  const [lectureSchedule, setLectureSchedule] = useState([]);
  const [labSchedule, setLabSchedule] = useState([]);

  // UI control states for item selection panels
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("subjects");

  // Reference for printing
  const printRef = useRef();


  // Add this new function for Excel export
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // --- LECTURE SHEET ---
    const lectureData = formatLectureDataForExcel();
    const lectureWs = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(lectureWs, lectureData);

    applyWrapTextToSheet(lectureWs);
    lectureWs['!cols'] = [{ wch: 15 }, ...Array(6).fill({ wch: 25 })];
    XLSX.utils.book_append_sheet(wb, lectureWs, "Lecture Schedule");

    // --- LAB SHEET (if exists) ---
    if (labSchedule.length > 0) {
      const labData = formatLabDataForExcel();
      const labWs = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(labWs, labData);

      applyWrapTextToSheet(labWs);
      labWs['!cols'] = [{ wch: 15 }, ...Array(6).fill({ wch: 25 })];
      XLSX.utils.book_append_sheet(wb, labWs, "Lab Schedule");
    }

    // --- SAVE ---
    const fileName = `${selectedClass.replace(/[()]/g, "")}_Timetable_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Helper to apply wrap text styling to a sheet
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

  // Replace the formatLectureDataForExcel function with this corrected version

  const formatLectureDataForExcel = () => {
    const result = [];

    // Add header row
    const header = ["Time Slot", ...days];
    result.push(header);

    lectureTimes.forEach((timeSlot) => {
      const row = [timeSlot.display];

      days.forEach((day) => {
        const cellKey = `${timeSlot.id}-${day}`;
        const entry = lectureSchedule.find((slot) => slot.id === cellKey);

        if (entry) {
          // Use the correct property name - entry.professor instead of entry.professor_name
          const cellContent = [
            entry.subject_code || "",
            entry.professor ? `Prof: ${entry.professor}` : "",
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

  // Also fix the formatLabDataForExcel function for consistency
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
          // Use the correct property name - entry.professor instead of entry.professor_name
          const cellContent = [
            entry.subject_code ? `🧪 ${entry.subject_code}` : "",
            entry.professor ? `Prof: ${entry.professor}` : "",
            entry.room ? `Room: ${entry.room}` : ""
          ]
            .filter(Boolean)
            .join("\r\n"); // Use \r\n for Excel line breaks

          row.push({ v: cellContent, t: "s", s: { alignment: { wrapText: true } } });
        } else {
          row.push("");
        }
      });

      result.push(row);
    });

    return result;
  };

  // Add this function to convert professor IDs to names
  const getProfessorNameById = (professorId) => {
    // Check in both lecture and lab professor lists
    const allProfessors = [...professors, ...labProfessors];

    // First try to find by exact ID match
    const professorById = allProfessors.find(prof => prof.id === professorId || prof._id === professorId);
    // console.log("Proffessor Name--->" , professorById.name);

    if (professorById) return professorById.name;

    // If that fails, try to find by string comparison (in case the ID is stored as a string)
    const professorByStringId = allProfessors.find(prof =>
      String(prof.id) === String(professorId) || String(prof._id) === String(professorId)
    );
    if (professorByStringId) return professorByStringId.name;

    // If that fails, return the ID as is (as a fallback)
    return professorId;
  };
  // Helper function to get the auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    return token;
  };
  // Fetch data from backend when component mounts
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

  // Function to handle any authentication errors
  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  // Add a function to filter subjects by year
  const filterSubjectsByYear = (allSubjectsData, yearClass) => {
    // Extract year code from the class selection (Second-Year (SY), Third-Year (TY), etc.)
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

    console.log("Filtering subjects for year:", yearPrefix);

    // Filter subjects by year field - this matches your backend model structure
    const yearFilteredSubjects = allSubjectsData.filter(subject =>
      subject.year === yearPrefix
    );

    console.log(`Found ${yearFilteredSubjects.length} subjects for ${yearPrefix}`);

    // If no subjects match the year filter, show all subjects as a fallback
    const subjectsToUse = yearFilteredSubjects.length > 0 ? yearFilteredSubjects : allSubjectsData;

    // Separate lecture and lab subjects
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

  const fetchSubjects = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_SUBJECTS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Format subjects for lecture and lab
      const allSubjects = response.data?.data || [];
      // console.log("getAllSubject", allSubjects);

      // Separate lecture and lab subjects
      const lectureSubjects = allSubjects
        .filter(subject => subject.type === 'lecture')
        .map((subject, index) => ({
          id: index + 1,
          name: subject.name,
          _id: subject._id
        }));

      const labSubjectsList = allSubjects
        .filter(subject => subject.type === 'lab')
        .map((subject, index) => ({
          id: index + 1,
          name: subject.name,
          _id: subject._id
        }));

      setSubjects(lectureSubjects);
      setLabSubjects(labSubjectsList);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      handleAuthError(error);
    }
  };

  const fetchProfessors = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_PROFESSORS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      const allProfessors = response.data?.users || [];

      const formattedProfessors = allProfessors.map((professor) => {
        // Handle different name formats
        let fullName;
        if (professor.name) {
          fullName = professor.name;
        } else if (professor.firstName && professor.lastName) {
          fullName = `${professor.firstName} ${professor.lastName}`;
        } else if (professor.fullName) {
          fullName = professor.fullName;
        } else {
          fullName = `Unknown Professor`;
        }

        return {
          id: professor._id, // Use MongoDB _id as id
          _id: professor._id, // Keep the original _id as well
          name: fullName,
          // Include other properties we might need
          emailId: professor.emailId,
          role: professor.role
        };
      });

      console.log("Formatted professors:", formattedProfessors);

      setProfessors(formattedProfessors);
      setLabProfessors(formattedProfessors);
    } catch (error) {
      console.error("Error fetching professors:", error);
      handleAuthError(error);
    }
  };

  // For classrooms
  const fetchClassrooms = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_CLASSROOMS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Log the raw data structure
      // console.log("Raw classroom API response:", response.data);

      // Format classrooms
      const allClassrooms = response.data?.data || [];

      // Check if type property exists and log the unique types
      const classroomTypes = [...new Set(allClassrooms.map(c => c.type))];
      // console.log("Available classroom types:", classroomTypes);

      // Try without filtering first if you're getting empty arrays
      const lectureClassrooms = allClassrooms.map((classroom, index) => ({
        id: index + 1,
        name: classroom.name,
        _id: classroom._id,
        type: classroom.type // Keep for debugging
      }));

      // console.log("All classrooms:", lectureClassrooms);

      // Now filter based on the type if needed
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

      // console.log("Filtered lecture classrooms:", filteredLectureClassrooms);
      // console.log("Filtered lab classrooms:", filteredLabClassrooms);

      // If filtering returns empty arrays, use all classrooms for both
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

  const handleAddItemToBackend = async (itemName, itemType) => {
    try {
      const token = getAuthToken();
      let apiEndpoint;

      switch (activeTab) {
        case "subjects":
          apiEndpoint = GET_SUBJECTS_API;
          break;
        case "professors":
          apiEndpoint = GET_PROFESSORS_API;
          break;
        case "classrooms":
          apiEndpoint = GET_CLASSROOMS_API;
          break;
        default:
          console.error("Unknown item type");
          return;
      }

      // Add the new item to the backend
      await axios.post(apiEndpoint, {
        name: itemName,
        type: activeScheduleType
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Refresh the data from backend
      if (activeTab === "subjects") {
        fetchSubjects();
      } else if (activeTab === "professors") {
        fetchProfessors();
      } else if (activeTab === "classrooms") {
        fetchClassrooms();
      }

    } catch (error) {
      console.error(`Error adding ${activeTab}:`, error);
      handleAuthError(error);
    }
  };


  // Update the fetchTimetableData function to deal with professor IDs
  const fetchTimetableData = async () => {
    if (!timetableId) return;

    try {
      setLoading(true);
      // First fetch all professors to ensure we have the data for conversion
      try {
        const token = getAuthToken();
        const profResponse = await axios.get(`${GET_ALL_USER_API}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        console.log("professor data -----> ", profResponse.data);

        if (profResponse.data && profResponse.data.users && Array.isArray(profResponse.data.users)) {
          setProfessors(profResponse.data.users);
          setLabProfessors(profResponse.data.users);
        }
      } catch (profErr) {
        console.error("Could not fetch professors:", profErr);
        // Continue anyway, we'll display IDs instead of names
      }

      // Now fetch the timetable data
      const response = await axios.get(`${BASE_URL}/tt/${timetableId}`);
      console.log(response);
      const data = response.data;

      console.log("Fetched timetable data:", data);

      // Set class and other metadata
      if (data.class) {
        setSelectedClass(data.class);

        // Once we know the class, fetch and filter subjects and classrooms specific to this year
        await fetchSubjectsForYear(data.class);
        await fetchClassroomsForYear(data.class);
      }

      // Process and separate lecture and lab slots
      const lectureSlots = [];
      const labSlots = [];

      // Extract lab phase from the first lab slot (if any) and set it
      if (data.lectures && data.lectures.days && Array.isArray(data.lectures.days)) {
        // Look for lab slots to determine the lab phase time
        for (const dayData of data.lectures.days) {
          if (dayData.slots && Array.isArray(dayData.slots)) {
            // Find the first lab slot to extract its time
            const labSlot = dayData.slots.find(slot => slot.type === 'lab');
            if (labSlot && labSlot.time) {
              // Set the lab phase time from the data
              setSelectedLabPhase(labSlot.time);
              console.log("Found lab phase time:", labSlot.time);
              break; // Once we find one lab slot with time, we're done
            }
          }
        }

        // Process all slots
        data.lectures.days.forEach(dayData => {
          if (dayData.slots && Array.isArray(dayData.slots)) {
            dayData.slots.forEach((slot) => {
              // Clone the slot to avoid mutation issues
              const processedSlot = { ...slot };

              // Store both the professor ID and resolve the name
              if (slot.professor) {
                processedSlot.professor_id = slot.professor;
                // Convert professor ID to name right away
                processedSlot.professor = getProfessorNameById(slot.professor);
              }

              if (slot.type === 'lab') {
                labSlots.push(processedSlot);
              } else {
                lectureSlots.push(processedSlot);
              }
            });
          }
        });
      }

      console.log("Processed lecture slots:", lectureSlots);
      console.log("Processed lab slots:", labSlots);

      setLectureSchedule(lectureSlots);
      setLabSchedule(labSlots);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      setLoading(false);
      alert("Error fetching timetable data: " + error.message);
    }
  };

  // New function to fetch subjects specific to a year
  const fetchSubjectsForYear = async (yearClass) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_SUBJECTS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Store all subjects for reference
      const allSubjectsData = response.data?.data || [];
      setAllSubjects(allSubjectsData);

      // Extract year code from the class selection
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

      console.log("Filtering subjects for year:", yearPrefix);

      // Filter subjects by year field
      const yearFilteredSubjects = allSubjectsData.filter(subject =>
        subject.year === yearPrefix
      );

      console.log(`Found ${yearFilteredSubjects.length} subjects for ${yearPrefix}`);

      // If no subjects match the year filter, show all subjects as a fallback
      const subjectsToUse = yearFilteredSubjects.length > 0 ? yearFilteredSubjects : allSubjectsData;

      // Separate lecture and lab subjects
      const lectureSubjects = subjectsToUse
        .filter(subject => subject.type === 'lecture')
        .map((subject, index) => ({
          id: index + 1,
          name: subject.name,
          _id: subject._id,
          year: subject.year
        }));

      const labSubjectsList = subjectsToUse
        .filter(subject => subject.type === 'lab')
        .map((subject, index) => ({
          id: index + 1,
          name: subject.name,
          _id: subject._id,
          year: subject.year
        }));

      setSubjects(lectureSubjects);
      setLabSubjects(labSubjectsList);
    } catch (error) {
      console.error("Error fetching subjects for year:", error);
      handleAuthError(error);
    }
  };

  // New function to fetch classrooms specific to a year
  const fetchClassroomsForYear = async (yearClass) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(GET_CLASSROOMS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Store all classrooms
      const allClassroomsData = response.data?.data || [];
      setAllClassrooms(allClassroomsData);

      // Extract year code
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
        yearPrefix = "SY";
      }

      // Filter classrooms by year if they have a year property
      // Some classrooms might be general and not specific to a year
      const yearFilteredClassrooms = allClassroomsData.filter(classroom =>
        !classroom.year || classroom.year === yearPrefix
      );

      const classroomsToUse = yearFilteredClassrooms.length > 0 ?
        yearFilteredClassrooms : allClassroomsData;

      // Separate lecture and lab classrooms
      const lectureClassrooms = classroomsToUse
        .filter(classroom => classroom.type === 'lecture' || !classroom.type)
        .map((classroom, index) => ({
          id: index + 1,
          name: classroom.name,
          _id: classroom._id,
          year: classroom.year
        }));

      const labClassroomsList = classroomsToUse
        .filter(classroom => classroom.type === 'lab' || !classroom.type)
        .map((classroom, index) => ({
          id: index + 1,
          name: classroom.name,
          _id: classroom._id,
          year: classroom.year
        }));

      setClassrooms(lectureClassrooms);
      setLabClassrooms(labClassroomsList);
    } catch (error) {
      console.error("Error fetching classrooms for year:", error);
      handleAuthError(error);
    }
  };

  // Fetch data on component mount if in update mode
  useEffect(() => {
    if (isUpdateMode && timetableId) {
      fetchTimetableData();
    }
  }, [timetableId, isUpdateMode]);

  // Get current schedule and setter based on active schedule type
  const getCurrentSchedule = () => {
    return activeScheduleType === "lecture" ? lectureSchedule : labSchedule;
  };

  // set a data in labSchedule & lecture schedule
  const setCurrentSchedule = (schedule) => {
    if (activeScheduleType === "lecture") {
      setLectureSchedule(schedule);
    } else {
      setLabSchedule(schedule);
    }
  };
  // Handle tab change with reset of selected item
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedItem(null); // Reset selected item when changing tabs
  };

  // Handle schedule type toggle with item deselection
  const handleScheduleTypeChange = (type) => {
    // Don't do anything if we're already on this tab
    if (type === activeScheduleType) return;

    // Set the new schedule type
    setActiveScheduleType(type);

    // Reset selected item to null when switching tabs
    setSelectedItem(null);
  };

  // Get current items based on active tab ( lab & lecture ) and schedule type
  const getCurrentItems = () => {
    if (activeScheduleType === "lecture") {
      switch (activeTab) {
        case "subjects": return subjects;
        case "professors": return professors;
        case "classrooms": return classrooms;
        default: return [];
      }
    } else {
      switch (activeTab) {
        case "subjects": return labSubjects;
        case "professors": return labProfessors;
        case "classrooms": return labClassrooms;
        default: return [];
      }
    }
  };

  // Get current setter for items
  const getCurrentSetter = () => {
    if (activeScheduleType === "lecture") {
      switch (activeTab) {
        case "subjects": return setSubjects;
        case "professors": return setProfessors;
        case "classrooms": return setClassrooms;
        default: return () => { };
      }
    } else {
      switch (activeTab) {
        case "subjects": return setLabSubjects;
        case "professors": return setLabProfessors;
        case "classrooms": return setLabClassrooms;
        default: return () => { };
      }
    }
  };

  // Handle class selection change
  const handleClassChange = (e) => {
    const newSelectedClass = e.target.value;
    setSelectedClass(newSelectedClass);

    // Apply filtering when class changes
    fetchSubjectsForYear(newSelectedClass);
    fetchClassroomsForYear(newSelectedClass);
  };

  // Handle lab phase selection change
  const handleLabPhaseChange = (e) => {
    setSelectedLabPhase(e.target.value);
  };


  const handleCellClick = (timeSlot, day) => {
    if (timeSlot.isStatic) return;
    if (!selectedItem) return;

    const isProf = activeTab === "professors";
    const key = activeTab === "subjects" ? "subject_code"
      : isProf ? "professor"
        : "room";

    const cellKey = `${timeSlot.id}-${day}`;
    const currentSchedule = getCurrentSchedule();
    let updated = false;

    const updatedSchedule = currentSchedule.map(slot => {
      if (slot.id === cellKey) {
        updated = true;
        const updatedSlot = { ...slot, [key]: selectedItem.name };

        // If this is a professor, store both name and ID
        if (isProf && selectedItem._id) {
          updatedSlot.professor_id = selectedItem._id;
        }
        return updatedSlot;
      }
      return slot;
    });

    if (!updated) {
      const newSlot = {
        id: cellKey,
        time: timeSlot.display,
        day: day,
        [key]: selectedItem.name,
        type: activeScheduleType
      };

      // Same ID handling for new slots
      if (isProf && selectedItem._id) {
        newSlot.professor_id = selectedItem._id;
      }

      updatedSchedule.push(newSlot);
    }

    console.log(`Updated ${activeScheduleType} schedule:`, updatedSchedule);
    setCurrentSchedule(updatedSchedule);
  };

  // Handle Delete Action
  const handleDelete = (timeSlot, day) => {
    const cellKey = `${timeSlot.id}-${day}`;
    const currentSchedule = getCurrentSchedule();
    setCurrentSchedule(currentSchedule.filter(slot => slot.id !== cellKey));
  };

  // Handle click on an item to select it
  const handleItemClick = (item, type) => {
    if (!item) {
      setSelectedItem(null);
      return;
    }

    // Use id or _id, whichever exists
    const itemId = item.id || item._id;
    if (!itemId) {
      console.warn("Item is missing both ID and _id properties:", item);
      return;
    }
    setSelectedItem({ id: itemId, name: item.name, type, _id: item._id });
  };

  // Handle zoom level change
  const handleZoomChange = (newZoomLevel) => {
    setZoomLevel(Math.max(50, Math.min(150, newZoomLevel)));
  };

  // Handle adding a new item
  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const currentItems = getCurrentItems();
    const setItems = getCurrentSetter();

    const maxId = currentItems.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem = { id: maxId + 1, name: newItemName.trim() };

    setItems([...currentItems, newItem]);
    setNewItemName("");
    setShowAddModal(false);
  };

  const handleMergedSubmit = async () => {
    try {
      console.log("Starting timetable submission...");

      // Create a combined structure that matches your desired format
      // All slots (both lectures and labs) will be organized by day
      const combinedDaysMap = {};

      // First process lecture slots
      lectureSchedule.forEach(slot => {
        const day = slot.day;

        // Initialize the day in our map if it doesn't exist
        if (!combinedDaysMap[day]) {
          combinedDaysMap[day] = {
            day: day,
            slots: []
          };
        }

        // Create a properly formatted slot object
        const formattedSlot = {
          id: slot.id,
          day: slot.day,
          time: slot.time,
          subject_code: slot.subject_code || '',
          room: slot.room || '',
          type: 'lecture'
        };

        // Handle professor data properly
        if (slot.professor_id) {
          // Use the stored ID directly
          formattedSlot.professor = slot.professor_id;
        } else if (slot.professor) {
          // Look up the professor ID by name
          const professorObj = professors.find(p => p.name === slot.professor);
          if (professorObj && professorObj._id) {
            formattedSlot.professor = professorObj._id;
          } else {
            console.warn(`Professor not found: ${slot.professor}`);
            formattedSlot.professor = slot.professor;
          }
        }

        // If there's an _id from the original data, keep it
        if (slot._id) {
          formattedSlot._id = slot._id;
        }

        // Add this slot to the appropriate day
        combinedDaysMap[day].slots.push(formattedSlot);
      });

      // Then process lab slots and add them to the same structure
      labSchedule.forEach(slot => {
        const day = slot.day;

        // Initialize the day in our map if it doesn't exist
        if (!combinedDaysMap[day]) {
          combinedDaysMap[day] = {
            day: day,
            slots: []
          };
        }

        // Create a properly formatted slot object
        const formattedSlot = {
          id: slot.id,
          day: slot.day,
          time: selectedLabPhase, // Use the selected lab phase time
          subject_code: slot.subject_code || '',
          room: slot.room || '',
          type: 'lab'
        };

        // Handle professor data properly
        if (slot.professor_id) {
          formattedSlot.professor = slot.professor_id;
        } else if (slot.professor) {
          const professorObj = labProfessors.find(p => p.name === slot.professor);
          if (professorObj && professorObj._id) {
            formattedSlot.professor = professorObj._id;
          } else {
            console.warn(`Lab professor not found: ${slot.professor}`);
            formattedSlot.professor = slot.professor;
          }
        }

        // If there's an _id from the original data, keep it
        if (slot._id) {
          formattedSlot._id = slot._id;
        }

        // Add this slot to the appropriate day
        combinedDaysMap[day].slots.push(formattedSlot);
      });

      // Convert our map to an array of days
      const combinedDays = Object.values(combinedDaysMap);

      // Create the final payload matching your desired structure
      const payload = {
        class: selectedClass,
        effective_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        lectures: { days: combinedDays }
      };

      console.log("Formatted payload:", payload);

      // Submit data
      const token = getAuthToken();
      const url = isUpdateMode ? `${BASE_URL}/tt/update/${id}` : URL;

      const response = await axios.put(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // console.log("Update response:", response.data);

      toast.success("Timetable saved successfully!");
    }
    catch (error) {
      console.error("Error in handleMergedSubmit:", error);
      console.error("Error details:", error.response?.data || "No detailed error information");
      toast.error(`Error ${isUpdateMode ? 'updating' : 'saving'} timetable: ` + error.message);
    }
  };
  // Individual submit functions (for testing)
  const handleLectureSubmit = async () => {
    const daysData = [];
    days.forEach((day) => {
      const scheduleForDay = lectureSchedule.filter((slot) => slot.day === day);
      if (scheduleForDay.length > 0) {
        daysData.push({ day: day, slots: scheduleForDay });
      }
    });

    const formattedData = {
      class: selectedClass,
      effective_date: "2024-09-16",
      days: daysData
    };

    console.log("Lecture data:", formattedData);
    alert("Lecture data prepared (check console)");
  };

  const handleLabSubmit = async () => {
    const daysData = [];
    days.forEach((day) => {
      const scheduleForDay = labSchedule.filter((slot) => slot.day === day);
      if (scheduleForDay.length > 0) {
        daysData.push({ day: day, slots: scheduleForDay });
      }
    });

    const formattedData = {
      class: selectedClass,
      phase: selectedLabPhase,
      effective_date: "2024-09-16",
      days: daysData
    };

    console.log("Lab data:", formattedData);
    alert("Lab data prepared (check console)");
  };

  // Function to handle print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${selectedClass} Timetable`,
  });
  const handleGoBack = () => {
    // Navigate back to the previous page
    window.history.back();
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
 
    <div className="min-h-screen bg-gray-50 p-4 pt-4">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-md">
        <div className="p-4 md:p-6">

          {/* Header with back button and title */}
          <div className="p-4 border-b flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-indigo-600">Update Timetable</h1>
          </div>
          {/* Left panel for controls and selection */}
          <div className="flex">
            <div className="w-1/4 min-w-[320px] border-r p-4">
              <div className="mb-6">

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
                  handleSubmit={activeScheduleType === "lecture" ? handleLectureSubmit : handleLabSubmit}
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
    </div>
  );
};
export default UpdateCombinedTimetable;