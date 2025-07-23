import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { HiOutlineBellAlert } from "react-icons/hi2";

const Navbar = () => {
    const { token, role, setToken, setRole } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
       localStorage.clear();
        setToken(null);
        setRole(null);
        // navigate('/login');
    };

    const adminButtons = [
        { label: 'Create TimeTable', path: '/createTimeTable', bgColor: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
        { label: 'View All TimeTables', path: '/showAllTimeTables', bgColor: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
        { label: 'Manage User', path: '/add-user', bgColor: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
        { label: 'Manage Class', path: '/add-class', bgColor: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
        { label: 'Manage Subject', path: '/add-subject', bgColor: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
    ];

    const userButtons = [
        { label: 'My TimeTable', path: '/user-dashboard', bgColor: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600' }
    ];

    return (
        <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 shadow-xl sticky top-0 z-50">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <h1 className="text-3xl font-bold cursor-pointer tracking-tight hover:scale-105 transition-transform">
                    <Link to="/">
                    <div className="flex items-center space-x-2 text-lg font-semibold">
  {/* Tilted and animated bell */}
  <div className=" text-white transform -rotate-12 hover:animate-bounce transition duration-300">
    <HiOutlineBellAlert size={28} />
  </div>

  {/* Gradient modern text */}
  <p className="tracking-wide  text-transparent text-white">
    ClassNotify
  </p>
</div>

                    </Link>
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                    {token && role === 'admin' && adminButtons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(btn.path)}
                            className={`${btn.bgColor} ${btn.hoverColor} px-4 py-2 rounded-lg shadow-md transition-all duration-300 font-semibold`}
                        >
                            {btn.label}
                        </button>
                    ))}

                    {token && role === 'user' && userButtons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(btn.path)}
                            className={`${btn.bgColor} ${btn.hoverColor} px-4 py-2 rounded-lg shadow-md transition-all duration-300 font-semibold`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <ul className="flex items-center gap-4 mt-4 md:mt-0">
                   

                    {!token && (
                        <>
                            <Link
                                to="/login"
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full shadow-md transition-all font-semibold"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full shadow-md transition-all font-semibold"
                            >
                                Signup
                            </Link>
                        </>
                    )}

                    {token && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full shadow-md transition-all font-semibold"
                        >
                            Logout
                        </button>
                    )}
                </ul>
            </div>
        </nav>
    );
};
export default Navbar;