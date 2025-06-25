import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/lib/supabase";

export default function DateTimeAvailability({ onChange }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [datesList, setDatesList] = useState([]);

  const handleAdd = () => {
    if (!selectedDate || !selectedTime || datesList.length >= 3) return;

    const dateTime = new Date(selectedDate);
    dateTime.setHours(selectedTime.getHours());
    dateTime.setMinutes(selectedTime.getMinutes());
    const updatedList = [...datesList, dateTime.toISOString()]
    setDatesList(updatedList);
    onChange(updatedList);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleRemove = (index) => {
    const newList = [...datesList];
    newList.splice(index, 1);
    setDatesList(newList);
    onChange(newList);
  };

//   const handleSubmit = async () => {
//     console.log("DATELIST:", datesList);
//     console.log("ID::::", id);
//     console.log("ROLE::::", role);
//     const { error } = await supabase.from(role + 's').upsert(
//       { id: id, availability: datesList },
//       { onConflict: "id" }
//     );

//     if (error) {
//       console.error("Supabase error:", error);
//     } else {
//       alert("Availability saved!");
//     }
//   };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Select up to 3 availability slots</h2>

      <div className="flex gap-4">
        <div>
          <label className="block text-gray-700">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="border p-2 rounded text-gray-700"
          />
        </div>

        <div>
          <label className="block text-gray-700">Time</label>
          <DatePicker
            selected={selectedTime}
            onChange={(time) => setSelectedTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Select time"
            className="border p-2 rounded text-gray-700"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedDate || !selectedTime || datesList.length >= 3}
          className="bg-emerald-500 cursor-point hover:bg-emerald-600 text-white px-4 py-2 rounded h-fit self-end"
        >
          Add
        </button>
      </div>

      <div>
        <p className="font-medium text-gray-700">Selected Slots:</p>
        <ul className="list-disc pl-5">
          {datesList.map((item, index) => (
            <li key={index} className="text-gray-700 flex items-center justify-between w-72">
              <span>{new Date(item).toLocaleString()}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 text-md cursor-pointer"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* <button
        onClick={}
        disabled={datesList.length === 0}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded"
      >
        Submit to Supabase
      </button> */}
    </div>
  );
}
