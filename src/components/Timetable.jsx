// import React from "react";

// const Timetable = ({
//   printRef,
//   days,
//   times,
//   schedule,
//   zoomLevel,
//   handleCellClick,
//   handleDelete,
//   handleSubmit,
//   selectedClass,
//   selectedPhase,
//   getProfessorNameById // Accept this function to resolve professor names
// }) => {
//   return (
//     <div className="w-full lg:w-4/5 overflow-x-auto" ref={printRef}>
//       <div className="mb-4 text-xl font-bold text-center">
//         {selectedClass} Timetable {selectedPhase && `- ${selectedPhase}`}
//       </div>

//       <table
//         className="w-full border border-gray-300 text-sm"
//         style={{
//           transform: `scale(${zoomLevel / 100})`,
//           transformOrigin: "top left",
//           width: `${100 * (100 / zoomLevel)}%`,
//         }}
//       >
//         <thead>
//           <tr className="bg-black text-white">
//             <th className="p-2 border w-20">Time</th>
//             {days.map((day) => (
//               <th key={day} className="p-2 border">{day}</th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {times.map((timeSlot) => (
//             <tr key={timeSlot.id} className={timeSlot.isStatic ? "bg-red-200" : ""}>
//               <td className="p-2 border text-center font-medium bg-yellow-200 ">{timeSlot.display}</td>
//               {days.map((day, index) => {
//                 if (timeSlot.isStatic) {
//                   return index === 0 ? (
//                     <td
//                       key={`${timeSlot.id}-${day}`}
//                       className="p-3 border text-center font-semibold text-red-600 bg-gray-200"
//                       colSpan={days.length}
//                     >
//                       {timeSlot.name}
//                     </td>
//                   ) : null;
//                 }

//                 const cellKey = `${timeSlot.id}-${day}`;
//                 const currentCell = schedule.find((slot) => slot.id === cellKey);

//                 return (
//                   <td
//                     key={cellKey}
//                     className="p-2 border h-20 text-center relative"
//                     onClick={() => handleCellClick(timeSlot, day)}
//                   >
//                     {/* Subjects - direct display of name */}
//                     {currentCell?.subject_code && (
//                       <div className="bg-blue-100 text-blue-700 p-1 rounded mb-1">
//                         {currentCell.subject_code}
//                       </div>
//                     )}

//                     {/* Professors - Display name using the conversion function */}
//                     {currentCell?.professor && (
//                       <div className="bg-green-100 text-green-700 p-1 rounded mb-1">
//                         {getProfessorNameById ? getProfessorNameById(currentCell.professor) : currentCell.professor_name || currentCell.professor}
//                       </div>
//                     )}

//                     {/* Classrooms - direct display of name */}
//                     {currentCell?.room && (
//                       <div className="bg-yellow-100 text-yellow-700 p-1 rounded">
//                         {currentCell.room}
//                       </div>
//                     )}

//                     {currentCell && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(timeSlot, day);
//                         }}
//                         className="absolute top-1 right-1 text-red-600 hover:text-red-800"
//                       >
//                         ×
//                       </button>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-4 flex justify-end">
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
//         >
//           Submit Timetable
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Timetable;




import React from "react";

const Timetable = ({
  printRef,
  days,
  times,
  schedule,
  zoomLevel,
  handleCellClick,
  handleDelete,
  selectedClass,
  selectedPhase,
  getProfessorNameById, // Function to resolve professor names
  getSubjectNameById, // Add similar functions for other item types if needed
  getClassroomNameById
}) => {
  // Helper function to safely get item name from either direct name property or by resolving ID
  const getItemName = (item, type) => {
    if (!item) return "";

    // If the item is already a string (name), return it
    if (typeof item === 'string') {
      return item;
    }

    // If the item has a name property, use that directly
    if (item.name) {
      return item.name;
    }

    // Based on type, use the appropriate resolver function
    switch (type) {
      case "professor":
        return getProfessorNameById ? getProfessorNameById(item) :
          (typeof item === 'object' ? item.name || item.id : item);
      case "subject":
        return getSubjectNameById ? getSubjectNameById(item) :
          (typeof item === 'object' ? item.name || item.id : item);
      case "classroom":
        return getClassroomNameById ? getClassroomNameById(item) :
          (typeof item === 'object' ? item.name || item.id : item);
      default:
        return typeof item === 'object' ? item.name || item.id || "Unknown" : item;
    }
  };

  return (
    <div className="w-full lg:w-4/5 overflow-x-auto" ref={printRef}>
      <div className="mb-4 text-xl font-bold text-center">
        {selectedClass} Timetable {selectedPhase && `- ${selectedPhase}`}
      </div>

      <table
        className="w-full border border-gray-300 text-sm"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top left",
          width: `${100 * (100 / zoomLevel)}%`,
        }}
      >
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 border w-20">Time</th>
            {days.map((day) => (
              <th key={day} className="p-2 border">{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {times.map((timeSlot) => (
            <tr key={timeSlot.id} className={timeSlot.isStatic ? "bg-red-200" : ""}>
              <td className="p-2 border text-center font-medium bg-yellow-200 ">{timeSlot.display}</td>
              {days.map((day, index) => {
                if (timeSlot.isStatic) {
                  return index === 0 ? (
                    <td
                      key={`${timeSlot.id}-${day}`}
                      className="p-3 border text-center font-semibold text-red-600 bg-gray-200"
                      colSpan={days.length}
                    >
                      {timeSlot.name}
                    </td>
                  ) : null;
                }

                const cellKey = `${timeSlot.id}-${day}`;
                const currentCell = schedule.find((slot) => slot.id === cellKey);

                return (
                  <td
                    key={cellKey}
                    className="p-2 border h-20 text-center relative"
                    onClick={() => handleCellClick(timeSlot, day)}
                  >
                    {/* Subject display with proper name resolution */}
                    {currentCell?.subject_code && (
                      <div className="bg-blue-100 text-blue-700 p-1 rounded mb-1">
                        {typeof currentCell.subject_code === 'object'
                          ? currentCell.subject_code.name || currentCell.subject_code
                          : currentCell.subject_code}
                      </div>
                    )}

                    {/* Professor display with proper name resolution */}
                    {currentCell?.professor && (
                      <div className="bg-green-100 text-green-700 p-1 rounded mb-1">
                        {getProfessorNameById ? getProfessorNameById(currentCell.professor) : currentCell.professor_name || currentCell.professor}
                      </div>
                    )}

                    {/* Classroom display with proper name resolution */}
                    {currentCell?.room && (
                      <div className="bg-yellow-100 text-yellow-700 p-1 rounded">
                        {typeof currentCell.room === 'object'
                          ? currentCell.room.name || currentCell.room
                          : currentCell.room}
                      </div>
                    )}

                    {currentCell && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(timeSlot, day);
                        }}
                        className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Timetable;