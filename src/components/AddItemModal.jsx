// components/AddItemModal.js
import React from "react";

const AddItemModal = ({
  showAddModal,
  setShowAddModal,
  activeTab,
  newItemName,
  setNewItemName,
  handleAddItem
}) => {
  return (

    showAddModal && (

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New {activeTab === "subjects" ? "Subject" : activeTab === "professors" ? "Professor" : "Classroom"}
          </h3>

          <div className="mb-4">
            <label htmlFor="newItemName" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="newItemName"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={activeTab === "subjects" ? "e.g., Physics" : activeTab === "professors" ? "e.g., Dr. Johnson" : "e.g., Room D"}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewItemName("");
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              disabled={!newItemName.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddItemModal;