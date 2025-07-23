import React, { useState, useEffect } from "react";
import axios from "axios";
import { CREATE_USER_API, DELETE_USER_API, GET_ALL_USER_API } from "../utils/constants";
import Navbar from "./Navbar";

const User = () => {
  const [userData, setUserData] = useState({
    name: "",
    emailId: "",
    password: "",
    mobileNumber: ""
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all"); // For filtering users in sidebar

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    return token;
  };

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();
      const axiosInstance = axios.create();

      const res = await axiosInstance.get(GET_ALL_USER_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data && res.data.users) {
        setUsers(res.data.users);
      } else {
        console.error("Unexpected API response format:", res.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle unauthorized access
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!userData.name.trim() || !userData.emailId.trim() || !userData.password.trim() || !userData.mobileNumber.trim()) {
      return;
    }

    try {
      const token = getAuthToken();

      const res = await axios.post(
        CREATE_USER_API,
        {
          name: userData.name.trim(),
          emailId: userData.emailId.trim(),
          password: userData.password,
          mobileNumber: userData.mobileNumber.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data && res.data.user) {
        setUsers([...users, res.data.user]);
      } else {
        fetchUsers();
      }

      // Reset form fields
      setUserData({
        name: "",
        emailId: "",
        password: "",
        mobileNumber: ""
      });
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const removeUser = async (emailId) => {
    try {
      const token = getAuthToken();

      await axios.delete(DELETE_USER_API, {
        data: { emailId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsers(users.filter(user => user.emailId !== emailId));
    } catch (error) {
      console.error("Error removing user:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addUser();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800';
  };

  // Filter users by role for sidebar
  const getAdminUsers = () => users.filter(user => user.role === 'admin');
  const getRegularUsers = () => users.filter(user => user.role !== 'admin');
  
  // Get filtered users based on selected role
  const getFilteredUsers = () => {
    switch(selectedRole) {
      case 'admin':
        return getAdminUsers();
      case 'user':
        return getRegularUsers();
      default:
        return users;
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substr(0, 2);
  };

  const getRandomColor = (email) => {
    const colors = [
      'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-red-500', 'bg-orange-500',
      'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 
      'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
      'bg-cyan-500', 'bg-sky-500'
    ];
    
    // Simple hash function to get a consistent color for each email
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navbar - Fixed to Top */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg transform transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 -ml-64'} fixed h-full overflow-y-auto z-40`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Users</h2>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Role filter buttons */}
            <div className="mb-6">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setSelectedRole('all')}
                  className={`px-3 py-2 rounded-md text-left text-sm font-medium transition-colors duration-200 ${
                    selectedRole === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Users
                </button>
                <button 
                  onClick={() => setSelectedRole('admin')}
                  className={`px-3 py-2 rounded-md text-left text-sm font-medium transition-colors duration-200 ${
                    selectedRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Administrators
                </button>
                <button 
                  onClick={() => setSelectedRole('user')}
                  className={`px-3 py-2 rounded-md text-left text-sm font-medium transition-colors duration-200 ${
                    selectedRole === 'user' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Regular Users
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">User Directory</h3>
                {users.length > 0 ? (
                  <ul className="space-y-2">
                    {users.map(user => (
                      <li key={user._id || user.emailId} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getRandomColor(user.emailId)}`}>
                          {getInitials(user.name)}
                        </div>
                        <div className="ml-3 overflow-hidden">
                          <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.emailId}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No users available</p>
                )}
                
                <button
                  onClick={fetchUsers}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
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
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          </div>

          {/* Add User Form Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New User</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter full name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={userData.emailId}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={userData.mobileNumber}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter mobile number"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addUser}
              disabled={!userData.name.trim() || !userData.emailId.trim() || !userData.password.trim() || !userData.mobileNumber.trim()}
              className={`w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${
                (!userData.name.trim() || !userData.emailId.trim() || !userData.password.trim() || !userData.mobileNumber.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add User
            </button>
          </div>

          {/* Users Card Grid */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedRole === 'admin' ? 'Administrators' : 
               selectedRole === 'user' ? 'Regular Users' : 'All Users'}
            </h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {getFilteredUsers().length} {getFilteredUsers().length === 1 ? 'user' : 'users'}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : getFilteredUsers().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredUsers().map((user) => (
                <div 
                  key={user._id || user.emailId} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`h-2 ${getRoleColor(user.role)}`}></div>
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${getRandomColor(user.emailId)}`}>
                        {getInitials(user.name)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role || 'user'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{user.emailId}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{user.mobileNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeUser(user.emailId)}
                        disabled={user.role === 'admin'}
                        className={`flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 ${
                          user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {user.role === 'admin' ? 'Protected' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-gray-600 mb-4">No users available</p>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Refresh Users
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;