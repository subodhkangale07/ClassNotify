import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="font-sans antialiased text-gray-900">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Schedule Smarter with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
                  ClassNotify
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg mx-auto lg:mx-0">
                The modern timetable solution for educational institutions.
                Create, manage, and receive notifications for classes with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="   px-8 mb-16 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300 shadow-lg shadow-indigo-900/30 text-center"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/demo"
                  className="px-8 py-3 mb-16 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-300 text-center"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              {/* Custom SVG illustration */}
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        Class Schedule
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-200">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-indigo-600 font-medium">
                              9:00 - 10:30 AM
                            </p>
                            <p className="font-semibold">Data Structures</p>
                          </div>
                          <div className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-md h-fit">
                            Room 301
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-purple-600 font-medium">
                              11:00 - 12:30 PM
                            </p>
                            <p className="font-semibold">Machine Learning</p>
                          </div>
                          <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-md h-fit">
                            Room 205
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-blue-600 font-medium">
                              2:00 - 3:30 PM
                            </p>
                            <p className="font-semibold">Database Systems</p>
                          </div>
                          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md h-fit">
                            Room 103
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">
                            Reminder: Machine Learning
                          </p>
                          <p className="text-xs">Starts in 30 minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,128L60,138.7C120,149,240,171,360,176C480,181,600,171,720,144C840,117,960,75,1080,64C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Designed for Educational Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ClassNotify offers intuitive tools that streamline scheduling,
              provide clarity, and enhance communication for everyone on
              campus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden group hover:shadow-md transition duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-indigo-200 to-transparent rounded-bl-3xl opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <div className="bg-indigo-100 rounded-2xl p-3 inline-block mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Drag & Drop Timetable</h3>
              <p className="text-gray-600">
                Admins can create and manage timetables with intuitive drag &
                drop functionality, eliminating tedious Excel spreadsheets.
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-indigo-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Visual scheduling interface
                </li> 
                
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-sm border border-purple-100 relative overflow-hidden group hover:shadow-md transition duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-purple-200 to-transparent rounded-bl-3xl opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <div className="bg-purple-100 rounded-2xl p-3 inline-block mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Schedules</h3>
              <p className="text-gray-600">
                Professors can access their own personalized timetables showing
                exactly what classes they have each day.
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Daily and weekly views
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Room and class information
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden group hover:shadow-md transition duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-blue-200 to-transparent rounded-bl-3xl opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <div className="bg-blue-100 rounded-2xl p-3 inline-block mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Notifications</h3>
              <p className="text-gray-600">
                Receive timely reminders about upcoming lectures 30 minutes
                before they begin, ensuring you're always prepared.
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Customizable alert timing
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Multi-platform notifications
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Class details included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How ClassNotify Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From scheduling to notifications in three simple steps
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-24 left-0 w-full border-t-2 border-dashed border-indigo-200"></div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="relative text-center">
                <div className="bg-white w-12 h-12 mx-auto rounded-full border-2 border-indigo-500 text-indigo-500 text-xl font-bold flex items-center justify-center mb-6 relative z-10">
                  1
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  <h3 className="text-xl font-bold mb-4">Admin Creates Schedule</h3>
                  <p className="text-gray-600">
                    Administrators create and manage class schedules using our
                    intuitive drag-and-drop interface.
                  </p>
                </div>
              </div>

              <div className="relative text-center">
                <div className="bg-white w-12 h-12 mx-auto rounded-full border-2 border-indigo-500 text-indigo-500 text-xl font-bold flex items-center justify-center mb-6 relative z-10">
                  2
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  <h3 className="text-xl font-bold mb-4">
                    Professors Access Timetables
                  </h3>
                  <p className="text-gray-600">
                    Faculty members view their personalized teaching schedules
                    on any device.
                  </p>
                </div>
              </div>

              <div className="relative text-center">
                <div className="bg-white w-12 h-12 mx-auto rounded-full border-2 border-indigo-500 text-indigo-500 text-xl font-bold flex items-center justify-center mb-6 relative z-10">
                  3
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  <h3 className="text-xl font-bold mb-4">
                    Receive Smart Notifications
                  </h3>
                  <p className="text-gray-600">
                    Get timely reminders 30 minutes before classes begin to
                    ensure preparation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience Our Drag & Drop Interface
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Say goodbye to tedious Excel sheets and hello to intuitive
                scheduling. Our modern interface makes creating and managing
                timetables a breeze.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                    <svg
                      className="h-4 w-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    Simply drag course blocks to desired time slots
                  </p>
                </div>
                               <div className="flex items-start">
               
                  
                </div>
              </div>
              <div className="mt-10">
                <Link
                  to="/schedule-demo"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Try Interactive Demo
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-2 shadow-xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mx-auto">
                      Admin Scheduling Interface
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-1 bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                        Time
                      </div>
                      <div className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                        MON
                      </div>
                      <div className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                        TUE
                      </div>
                      <div className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                        WED
                      </div>
                      <div className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                        THU
                      </div>
                      <div className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                        FRI
                      </div>

                      <div className="col-span-1 p-2 text-center text-xs font-medium text-gray-500 border-t border-gray-100">
                        9:00
                      </div>
                      <div className="bg-indigo-100 border border-indigo-200 p-2 rounded text-xs col-span-2">
                        <div className="font-medium text-indigo-800">
                          Data Structures
                        </div>
                        <div className="text-indigo-600">Room 301</div>
                      </div>
                      <div className="p-2"></div>
                      <div className="bg-purple-100 border border-purple-200 p-2 rounded text-xs col-span-2">
                        <div className="font-medium text-purple-800">
                          Machine Learning
                        </div>
                        <div className="text-purple-600">Room 205</div>
                      </div>

                      <div className="col-span-1 p-2 text-center text-xs font-medium text-gray-500 border-t border-gray-100">
                        10:00
                      </div>
                      <div className="bg-indigo-100 border border-indigo-200 p-2 rounded text-xs opacity-40"></div>
                      <div className="bg-green-100 border border-green-200 p-2 rounded text-xs col-span-2">
                        <div className="font-medium text-green-800">
                          Web Development
                        </div>
                        <div className="text-green-600">Room 102</div>
                      </div>
                      <div className="p-2"></div>
                      <div className="bg-purple-100 border border-purple-200 p-2 rounded text-xs opacity-40"></div>

                      <div className="col-span-1 p-2 text-center text-xs font-medium text-gray-500 border-t border-gray-100">
                        11:00
                      </div>
                      <div className="p-2"></div>
                      <div className="bg-green-100 border border-green-200 p-2 rounded text-xs opacity-40"></div>
                      <div className="p-2"></div>
                      <div className="bg-blue-100 border border-blue-200 p-2 rounded text-xs col-span-2">
                        <div className="font-medium text-blue-800">
                          Database Systems
                        </div>
                        <div className="text-blue-600">Room 103</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="bg-yellow-100 border border-yellow-200 p-1.5 rounded text-xs">
                          <div className="font-medium text-yellow-800">
                            Algorithms
                          </div>
                        </div><div className="bg-red-100 border border-red-200 p-1.5 rounded text-xs">
                          <div className="font-medium text-red-800">
                            Operating Systems
                          </div>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-indigo-700 transition duration-300">
                        Publish Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Are Saying
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Read how ClassNotify has transformed the scheduling experience
              for educational institutions.
            </p>
          </div>
           <div>
            Comig Soon...
           </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-lg text-indigo-100 mb-10">
            Join  educational institutions that trust ClassNotify
            for their scheduling needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300 shadow-lg shadow-indigo-900/30"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-300"
            >
            Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h4 className="text-xl font-semibold mb-4">ClassNotify</h4>
          <p className="text-gray-400 text-sm">
            Modern timetable solution for educational institutions.
          </p>
          <div className="flex space-x-4 mt-4">
            {['facebook', 'twitter', 'linkedin'].map((platform, idx) => (
              <a key={idx} href="#" className="text-gray-400 hover:text-white transition">
                <i className={`fab fa-${platform} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4">Contact</h4>
          <p className="text-gray-400 text-sm">Email: support@classnotify.com</p>
          <p className="text-gray-400 text-sm">Phone: +91 97303 75652</p>
          <p className="text-gray-400 text-sm mt-2">Location: Sangli, India</p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ClassNotify. All rights reserved.
      </div>
    </footer>
    </div>
  );
};
export default Home;