import React, { useState, useEffect } from "react";
import axios from "axios";
import { CREATE_SUBJECT_API, DELETE_SUBJECT_API, GET_ALL_SUBJECT_API } from "../utils/constants";
import Navbar from "./Navbar";

const Subject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectType, setSubjectType] = useState("lab");
  const [subjectYear, setSubjectYear] = useState("FY");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    return token;
  };

  const fetchSubjects = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();
      const axiosInstance = axios.create();

      const res = await axiosInstance.get(GET_ALL_SUBJECT_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data && res.data.data) {
        setSubjects(res.data.data);
      } else {
        console.error("Unexpected API response format:", res.data);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async () => {
    if (!subjectName.trim()) return;

    try {
      const token = getAuthToken();

      const res = await axios.post(
        CREATE_SUBJECT_API,
        {
          name: subjectName.trim(),
          type: subjectType,
          year: subjectYear
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data && res.data.newSubject) {
        setSubjects([...subjects, res.data.newSubject]);
        setSubjectName("");
      } else {
        fetchSubjects();
        setSubjectName("");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const removeSubject = async (id) => {
    try {
      const token = getAuthToken();

      await axios.delete(DELETE_SUBJECT_API, {
        data: { id },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSubjects(subjects.filter(subject => subject._id !== id));
    } catch (error) {
      console.error("Error removing subject:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSubject();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getTypeColor = (type) => {
    return type === 'lab' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';
  };

  const getYearColor = (year) => {
    const colors = {
      'FY': 'bg-purple-100 text-purple-800',
      'SY': 'bg-amber-100 text-amber-800',
      'TY': 'bg-indigo-100 text-indigo-800',
      'LY': 'bg-rose-100 text-rose-800'
    };
    return colors[year] || 'bg-gray-100 text-gray-800';
  };

  const yearFullNames = {
    'FY': 'First Year',
    'SY': 'Second Year',
    'TY': 'Third Year',
    'LY': 'Last Year'
  };

  // Filter subjects by year for sidebar
  const getFYSubjects = () => subjects.filter(subject => subject.year === 'FY');
  const getSYSubjects = () => subjects.filter(subject => subject.year === 'SY');
  const getTYSubjects = () => subjects.filter(subject => subject.year === 'TY');
  const getLYSubjects = () => subjects.filter(subject => subject.year === 'LY');

  return (
    <div className="relative min-h-screen bg-gray-50">
      
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      
      <div className="flex pt-16">
        <div className={`bg-white shadow-lg transform transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 -ml-64'} fixed h-full overflow-y-auto z-40`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Subjects</h2>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">First Year</h3>
                    {getFYSubjects().length > 0 ? (
                      <ul className="space-y-1">
                        {getFYSubjects().map(subject => (
                          <li key={subject._id} className="text-sm py-2 px-3 rounded-md hover:bg-gray-100 flex items-center justify-between">
                            <span className="truncate">{subject.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(subject.type)}`}>
                              {subject.type === 'lab' ? 'Lab' : 'Lec'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No subjects</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Second Year</h3>
                    {getSYSubjects().length > 0 ? (
                      <ul className="space-y-1">
                        {getSYSubjects().map(subject => (
                          <li key={subject._id} className="text-sm py-2 px-3 rounded-md hover:bg-gray-100 flex items-center justify-between">
                            <span className="truncate">{subject.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(subject.type)}`}>
                              {subject.type === 'lab' ? 'Lab' : 'Lec'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No subjects</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Third Year</h3>
                    {getTYSubjects().length > 0 ? (
                      <ul className="space-y-1">
                        {getTYSubjects().map(subject => (
                          <li key={subject._id} className="text-sm py-2 px-3 rounded-md hover:bg-gray-100 flex items-center justify-between">
                            <span className="truncate">{subject.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(subject.type)}`}>
                              {subject.type === 'lab' ? 'Lab' : 'Lec'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No subjects</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Last Year</h3>
                    {getLYSubjects().length > 0 ? (
                      <ul className="space-y-1">
                        {getLYSubjects().map(subject => (
                          <li key={subject._id} className="text-sm py-2 px-3 rounded-md hover:bg-gray-100 flex items-center justify-between">
                            <span className="truncate">{subject.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(subject.type)}`}>
                              {subject.type === 'lab' ? 'Lab' : 'Lec'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No subjects</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={fetchSubjects}
                  className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} flex-1 p-4 md:p-6`}>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 mr-4 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Subject Management</h1>
          </div>

          {/* Add Subject Form Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Subject</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter subject name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Subject Type
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="lab"
                    name="subjectType"
                    value="lab"
                    checked={subjectType === "lab"}
                    onChange={() => setSubjectType("lab")}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="lab" className="text-gray-700">Lab</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="lecture"
                    name="subjectType"
                    value="lecture"
                    checked={subjectType === "lecture"}
                    onChange={() => setSubjectType("lecture")}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="lecture" className="text-gray-700">Lecture</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Year
              </label>
              <select
                value={subjectYear}
                onChange={(e) => setSubjectYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="FY">First Year (FY)</option>
                <option value="SY">Second Year (SY)</option>
                <option value="TY">Third Year (TY)</option>
                <option value="LY">Last Year (LY)</option>
              </select>
            </div>

            <button
              onClick={addSubject}
              disabled={!subjectName.trim()}
              className={`w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${
                !subjectName.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add Subject
            </button>
          </div>

          {/* Subjects Card Grid */}
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Subjects</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : subjects && subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div 
                  key={subject._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`h-2 ${getYearColor(subject.year)}`}></div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{subject.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(subject.type)}`}>
                        {subject.type === 'lab' ? 'Laboratory' : 'Lecture'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{yearFullNames[subject.year] || subject.year}</span>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeSubject(subject._id)}
                        className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-600 mb-4">No subjects available</p>
              <button
                onClick={fetchSubjects}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Refresh Subjects
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subject;