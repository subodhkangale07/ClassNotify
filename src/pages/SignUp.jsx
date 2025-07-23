import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import Navbar from "../components/Navbar";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (data) => {
    try {
      const formData = { ...data, role };
      const response = await axios.post(`${USER_API_END_POINT}/signup`, formData);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Signup failed. Try again!";
      setError(errorMsg);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-6 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)]"
          style={{ backgroundSize: "30px 30px" }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Left Form Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Free</span>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">Nickname (Optional)</label>
                <input
                  id="nickname"
                  {...register("nickname")}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter a nickname"
                />
              </div>

              <div>
                <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="emailId"
                  {...register("emailId", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="your@email.com"
                />
                {errors.emailId && <p className="text-red-600 text-sm mt-1">{errors.emailId.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Create a strong password"
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  id="mobileNumber"
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                    minLength: { value: 10, message: "Mobile number must be at least 10 digits" }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your mobile number"
                />
                {errors.mobileNumber && <p className="text-red-600 text-sm mt-1">{errors.mobileNumber.message}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-4"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-purple-600 font-medium hover:text-purple-500">Sign in instead</a>
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Join ClassNotify</h1>
              <div className="h-1 w-16 bg-purple-300 mb-6"></div>
              <p className="text-purple-100 mb-8">Create your account today and stay connected with all your important class notifications.</p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-purple-500 bg-opacity-30 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Registration</h3>
                    <p className="text-purple-200 text-sm">Setup your account in minutes</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-purple-500 bg-opacity-30 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Access</h3>
                    <p className="text-purple-200 text-sm">Your data is protected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-purple-200 mt-10">&copy; 2025 ClassNotify. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
