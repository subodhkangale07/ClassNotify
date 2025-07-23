import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";

const Login = () => {
  const { setToken, setRole, role } = useAppContext();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, {
        emailId,
        password,
        role,
      });

      console.log("Login Reponse" , response);
      // console.log("Role ", role);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("userId", JSON.stringify(response.data.user._id));

        setToken(response.data.token);
        setRole(response.data.user.role);

        if (role === "admin") {
          navigate("/");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError("Unauthorized: Incorrect role.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Try again!");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div
          className="absolute inset-0 bg-grid-slate-100 bg-[top_1rem_center] [mask-image:linear-gradient(0deg,transparent,black)]"
          style={{ backgroundSize: "30px 30px" }}
        ></div>

        <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center relative z-10">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Panel - Brand Section */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 sm:p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">ClassNotify</h1>
                <div className="h-1 w-16 bg-purple-300 mb-6"></div>
                <p className="text-purple-100 mb-8 text-sm sm:text-base">
                  Stay informed, stay ahead - ClassNotify keeps you updated with all your important class notifications in one place.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start sm:items-center">
                    <div className="bg-purple-500 bg-opacity-30 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Secure Access</h3>
                      <p className="text-purple-200 text-xs sm:text-sm">Role-based authentication system</p>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center">
                    <div className="bg-purple-500 bg-opacity-30 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Real-time Notifications</h3>
                      <p className="text-purple-200 text-xs sm:text-sm">Never miss important updates</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs text-purple-200">&copy; 2025 ClassNotify. All rights reserved.</p>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="p-6 sm:p-8 md:p-12 w-full md:w-1/2">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Login to your account</h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">v2.0</span>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded shadow-sm">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    placeholder="your@email.com"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs text-purple-600 hover:text-purple-800 font-medium">Forgot password?</a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
                  <select
                    id="role"
                    className="w-full px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-purple-600 font-medium hover:text-purple-500">
                    Create one now
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-xs px-2 text-wrap">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-gray-700">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
