import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../utils/constants';

const UserPanel = () => {
  const getCurrentDate = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const today = new Date();
    const dayIndex = today.getDay() - 1;

    if (dayIndex < 0 || dayIndex > 4) {
      return 'Monday';
    }
    return days[dayIndex];
  };

  const today = new Date();
  const [professorId, setProfessorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const userIdString = localStorage.getItem('userId');
    console.log("Retrieved userId from localStorage:", userIdString);

    if (userIdString) {
      try {
        const userId = JSON.parse(userIdString);
        setProfessorId(userId);
        console.log("Parsed userId:", userId);
      } catch (parseError) {
        console.error("Error parsing userId from localStorage:", parseError);
        setError("Error retrieving user ID. Please log in again.");
        localStorage.removeItem('userId');
      }
    } else {
      console.log("No userId found in localStorage");
      setError("User ID not found in local storage. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (professorId) {
      fetchSchedule();
    }
  }, [selectedDay, professorId]);

  const fetchSchedule = async () => {
    if (!professorId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching schedule with:", { professorId, day: selectedDay });

      const response = await axios.post(BASE_URL+'/user/get', {
        professorId,
        day: selectedDay,
      });

      console.log("API Response:", response.data);

    

      if (response.data && response.data.data) {
        setSchedule(response.data.data);
      } else {
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);

      if (err.response) {
        setError(`Server error: ${err.response.data?.message || err.response.statusText || err.message}`);
        if (err.response.status === 401) {
          localStorage.removeItem('userId');
          setProfessorId('');
        }
      } else if (err.request) {
        setError("Could not connect to server. Please check your connection.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  // Function to parse time for sorting
  const parseTimeForSort = (timeString) => {
    if (!timeString) return 0;
    
    const [startTime] = timeString.split('-');
    if (!startTime) return 0;
    
    const [hours, minutes] = startTime.trim().split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  // Get all schedule items and sort them by time
  const getScheduleItems = () => {
    if (!schedule || !schedule.schedule) return { lectures: [], labs: [] };
    
    const allItems = [
      ...(schedule.schedule.lectures || []).map(item => ({ ...item, type: 'lecture' })),
      ...(schedule.schedule.labs || []).map(item => ({ ...item, type: 'lab' }))
    ];
    
    console.log("AI",allItems)
    // Sort items by time
    allItems.sort((a, b) => parseTimeForSort(a.time) - parseTimeForSort(b.time));
    
    // Separate into lectures and labs again
    const lectures = allItems.filter(item => item.type === 'lecture');
    const labs = allItems.filter(item => item.type === 'lab');
    
    return { lectures, labs };
  };

  const { lectures, labs } = getScheduleItems();
  const hasSchedule = lectures.length > 0 || labs.length > 0;

  if (!professorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-l-4 border-amber-500 rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Authentication Required</h2>
                <p className="mt-1 text-gray-600">Please log in to view your schedule.</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/login" className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
                Go to Login
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span className="block text-blue-800">Professor Schedule</span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-gray-500">
              Manage your daily teaching schedule and class information.
            </p>
          </div>

          {/* Day Selector Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-1/3">
                  <label htmlFor="daySelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Day
                  </label>
                  <div className="relative">
                    <select
                      id="daySelect"
                      className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm transition-colors duration-200"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {process.env.NODE_ENV === 'development' && (
                  <div className="w-full md:w-auto">
                    <button
                      onClick={fetchSchedule}
                      className="w-full md:w-auto flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Reload Schedule
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border-l-4 border-red-500">
              <div className="p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">An error occurred</h3>
                    <div className="mt-2 text-red-700 text-sm">{error}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Content */}
          {schedule && !loading && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
              {/* Schedule Header */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Schedule for {schedule.day}</h2>
                  <div className="hidden md:block bg-blue-800 text-blue-200 px-4 py-2 rounded-full text-sm">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* No Classes Message */}
              {!hasSchedule && (
                <div className="p-10 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-600">No Classes Scheduled</h3>
                  <p className="mt-2 text-gray-500">You don't have any classes scheduled for this day.</p>
                </div>
              )}

              {/* Classes Section - Two Column Layout */}
              {hasSchedule && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lectures Column */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Lectures
                      </h3>
                      
                      {lectures.length === 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 text-center text-gray-600">
                          <p>No lectures scheduled for this day</p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {lectures.map((lecture, index) => (
                          <div 
                            key={`lecture-${index}`} 
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-lg font-semibold text-gray-900">{lecture.subject_code || 'N/A'}</div>
                                <div className="mt-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{formatTime(lecture.time)}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{lecture.room || 'TBD'}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Class: {lecture.class}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Labs Column */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Laboratory Sessions
                      </h3>
                      
                      {labs.length === 0 && (
                        <div className="bg-purple-50 rounded-lg p-4 text-center text-gray-600">
                          <p>No laboratory sessions scheduled for this day</p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {labs.map((lab, index) => (
                          <div 
                            key={`lab-${index}`} 
                            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-purple-100"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-lg font-semibold text-gray-900">{lab.subject_code || 'N/A'}</div>
                                <div className="mt-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{formatTime(lab.time)}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{lab.room || 'TBD'}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Class: {lab.class}</span>
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;