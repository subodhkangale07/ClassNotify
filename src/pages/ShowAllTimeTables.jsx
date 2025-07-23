import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { DELETE_TimeTable, GET_ALL_Timetables } from '../utils/constants';
import { toast } from 'react-toastify';

function ShowAllTimeTables() {
    const [allTimeTables, setAllTimeTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate();

    const fetchAllTimeTables = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(GET_ALL_Timetables);
            setAllTimeTables(data);
        } catch (error) {
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTimeTables();
    }, []);

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/updateTimeTable/${id}`);
    };

    const handleOpenModal = (id, e) => {
        e.stopPropagation();
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`${DELETE_TimeTable}${selectedId}`);
            if (response.data.message === "Timetable deleted successfully") {
                toast.success(response.data.message);
                fetchAllTimeTables();
            } else {
                toast.error(response.data.message || "Failed to delete");
            }
        } catch (error) {
            toast.error("Error deleting timetable");
        } finally {
            setShowModal(false);
            setSelectedId(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <Navbar />
            </div>

            <div className="pt-20 px-6 pb-12 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">All Timetables</h2>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors flex items-center"
                        onClick={() => navigate('/createTimeTable')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Timetable
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allTimeTables.length > 0 ? (
                            allTimeTables.map((timeTable, index) => (
                                <div
                                    key={timeTable._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border"
                                    onClick={() => navigate(`/viewTimeTable/${timeTable._id}`)}
                                >
                                    <div className="px-6 py-4 bg-blue-50 border-b">
                                        <div className="font-bold text-xl text-blue-800 mb-1">
                                            Timetable {index + 1}
                                        </div>
                                        <p className="text-gray-600 text-sm">{timeTable.class || 'No class specified'}</p>
                                    </div>

                                    <div className="px-6 py-4">
                                        <p><span className="font-medium">ID:</span> {timeTable._id?.substring(0, 10)}...</p>
                                        {timeTable.section && <p><span className="font-medium">Section:</span> {timeTable.section}</p>}
                                        {timeTable.createdAt && (
                                            <p><span className="font-medium">Created:</span> {new Date(timeTable.createdAt).toLocaleDateString()}</p>
                                        )}
                                    </div>

                                    <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => handleEdit(timeTable._id, e)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                                                title="Edit Timetable"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleOpenModal(timeTable._id, e)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-full"
                                                title="Delete Timetable"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-600">No timetables found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center px-4">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
                        <p className="text-gray-600">Are you sure you want to delete this timetable? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowAllTimeTables;
