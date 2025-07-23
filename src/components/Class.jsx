import React, { useState, useEffect } from "react";
import axios from "axios";
import { CREATE_CLASS_API, DELETE_CLASS_API, GET_ALL_CLASS_API } from "../utils/constants";
import Navbar from "../components/Navbar";

const AddClass = () => {
  const [className, setClassName] = useState("");
  const [classType, setClassType] = useState("lab");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    return token;
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await axios.get(GET_ALL_CLASS_API, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setClasses(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const addClass = async () => {
    if (!className.trim()) return;
    try {
      const token = getAuthToken();
      const res = await axios.post(CREATE_CLASS_API, { name: className.trim(), type: classType }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setClasses([...classes, res.data?.newClass || {}]);
      setClassName("");
    } catch (error) {
      console.error("Error adding class:", error);
      if (error.response?.status === 401) handleLogout();
    }
  };

  const removeClass = async (name) => {
    try {
      const token = getAuthToken();
      await axios.delete(DELETE_CLASS_API, { data: { name }, headers: { 'Authorization': `Bearer ${token}` } });
      setClasses(classes.filter(cls => cls.name !== name));
    } catch (error) {
      console.error("Error removing class:", error);
      if (error.response?.status === 401) handleLogout();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addClass();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getTypeColor = (type) => {
    return type === 'lab' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
      : 'bg-indigo-100 text-indigo-800 border-indigo-300';
  };

  const getTypeBadgeColor = (type) => {
    return type === 'lab' 
      ? 'bg-emerald-500 text-white' 
      : 'bg-indigo-500 text-white';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navbar - Fixed to Top */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`font-bold text-gray-800 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            Classes
          </h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <div className="py-4">
          {loading ? (
            <div className="px-4 py-2 text-gray-500 text-sm">Loading...</div>
          ) : (
            <ul className="space-y-1">
              {classes.map((cls, index) => (
                <li key={`sidebar-${cls._id || index}`}>
                  <a 
                    href="#" 
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${sidebarOpen ? '' : 'justify-center'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cls.type === 'lab' ? 'bg-emerald-500' : 'bg-indigo-500'} mr-3`}></span>
                    {sidebarOpen && <span className="truncate">{cls.name}</span>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Class Management</h1>

            {/* Input Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Class Name</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter class name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Class Type Radio Buttons */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Class Type</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="lab" 
                    name="classType" 
                    value="lab" 
                    checked={classType === "lab"}
                    onChange={() => setClassType("lab")} 
                    className="mr-2 accent-emerald-500" 
                  />
                  <label htmlFor="lab" className="text-gray-700">Lab</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="lecture" 
                    name="classType" 
                    value="lecture" 
                    checked={classType === "lecture"}
                    onChange={() => setClassType("lecture")} 
                    className="mr-2 accent-indigo-500" 
                  />
                  <label htmlFor="lecture" className="text-gray-700">Lecture</label>
                </div>
              </div>
            </div>

            {/* Add Class Button */}
            <div className="mb-4">
              <button
                onClick={addClass}
                disabled={!className.trim()}
                className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
                  !className.trim() ? 'opacity-50 cursor-not-allowed' : '' }`}
              >
                Add Class
              </button>
            </div>
          </div>

          {/* Class Cards */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Class List</h2>
              <button
                onClick={fetchClasses}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls, index) => (
                  <div 
                    key={cls._id || index} 
                    className={`p-4 rounded-lg shadow-md border-l-4 ${getTypeColor(cls.type)} bg-white hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-800">{cls.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(cls.type)}`}>
                        {cls.type === 'lab' ? 'Lab' : 'Lecture'}
                      </span>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => removeClass(cls.name)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No classes available</p>
                <p className="text-gray-400 text-sm mt-2">Add a class to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClass;