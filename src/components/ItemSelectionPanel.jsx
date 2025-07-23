import React from "react";
import { FaDownload, FaSearchPlus, FaSearchMinus } from "react-icons/fa";

const ItemSelectionPanel = ({
  activeTab,
  setActiveTab,
  subjects,
  professors,
  classrooms,
  selectedItem,
  setSelectedItem,
  handleItemClick,
  zoomLevel,
  handleZoomChange,
  exportToExcel,
}) => {
  // Modified handleTabChange to handle potential issues with setSelectedItem
  const handleTabChange = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      
      // Only call setSelectedItem if it's a function
      if (typeof setSelectedItem === 'function') {
        setSelectedItem(null);
      }
      
      // Always notify parent component through handleItemClick
      handleItemClick(null, null);
    }
  };
  
  const getCurrentItems = () => {
    switch (activeTab) {
      case "subjects":
        return subjects.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item, "subject")}
            className={`p-3 my-2 rounded-lg cursor-pointer shadow-sm transition-all duration-300 ${
              selectedItem?.id === item.id && selectedItem?.type === "subject"
                ? "bg-gradient-to-r from-indigo-400 to-indigo-600 text-white border border-indigo-700"
                : "bg-gray-100 hover:bg-indigo-100"
            }`}
          >
            {item.name}
          </div>
        ));
      case "professors":
        return professors.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item, "professor")}
            className={`p-3 my-2 rounded-lg cursor-pointer shadow-sm transition-all duration-300 ${
              selectedItem?.id === item.id && selectedItem?.type === "professor"
                ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white border border-blue-700"
                : "bg-gray-100 hover:bg-blue-100"
            }`}
          >
            {item.name}
          </div>
        ));
      case "classrooms":
        return classrooms.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item, "classroom")}
            className={`p-3 my-2 rounded-lg cursor-pointer shadow-sm transition-all duration-300 ${
              selectedItem?.id === item.id && selectedItem?.type === "classroom"
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white border border-green-700"
                : "bg-gray-100 hover:bg-green-100"
            }`}
          >
            {item.name}
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="lg:w-full p-5 bg-white/50 backdrop-blur-md shadow-lg rounded-2xl flex flex-col space-y-4">
      {/* Tab Selection */}
      <div className="border-b pb-3 overflow-x-auto">
        <div className="flex space-x-2">
          {["subjects", "professors", "classrooms"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-2 px-4 font-medium text-sm rounded-lg transition-all min-w-fit ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Button & List Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">
            {activeTab === "subjects"
              ? "Select Subject"
              : activeTab === "professors"
              ? "Select Professor"
              : "Select Classroom"}
          </h3>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">{getCurrentItems()}</div>
      </div>

      {/* Selected Item Display */}
      {selectedItem && (
        <div className="p-3 bg-green-100 rounded-lg shadow-md">
          <p className="text-sm text-green-800">
            Selected: <span className="font-medium">{selectedItem.name}</span>
          </p>
          <p className="text-xs text-green-600">Click on a timetable cell to place</p>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="p-3 bg-blue-50 rounded-lg shadow-md">
        <h4 className="font-medium text-blue-800 mb-2 text-center">Zoom Control</h4>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => handleZoomChange(zoomLevel - 10)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
          >
            <FaSearchMinus />
          </button>
          <span className="text-blue-800 font-medium text-lg">{zoomLevel}%</span>
          <button
            onClick={() => handleZoomChange(zoomLevel + 10)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
          >
            <FaSearchPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionPanel;
