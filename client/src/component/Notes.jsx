import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Notes() {
    const [reminders, setReminders] = useState([]); // Renamed for clarity
    const [note, setNote] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        axios
            .get(`${backendUrl}/getdata`)
            .then((response) => {
                console.log(response.data);
                setReminders(response.data); // Correctly access response data
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleSubmit = () => {
        if (note.trim() === "") {
            alert("Note cannot be empty");
            return;
        }

        axios
            .post(`${backendUrl}/insdata`, { note })
            .then((response) => {
                setReminders((prevReminders) => [response.data, ...prevReminders]);
                setNote(""); // Clear the note input field
            })
            .catch((error) => {
                console.error("Error adding note:", error);
            });
    };

    const handleCheck = (id) => {
        const updatedReminder = reminders.find((reminder) => reminder._id === id); 
        axios
            .put(`${backendUrl}/complete/${id}`, updatedReminder)
            .then((response) => {
                setReminders((prevReminders) => {
                    const index = prevReminders.findIndex((reminder) => reminder._id === id);
                    const newReminders = [...prevReminders];
                    newReminders[index] = response.data;
                    return newReminders;
                });
            })
            .catch((error) => {
                console.error("Error updating note:", error);
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`${backendUrl}/delete/${id}`)
            .then(() => {
                setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== id));
            })
            .catch((error) => {
                console.error("Error deleting note:", error);
            });
    };

    return (
        <>
            <div className="p-4 m-2">
                <div className="h-fit m-5 w-auto block text-center justify-items-center text-4xl relative">
                    <p className="font-semibold text-teal-50">Notes App</p>
                </div>

                <div className="w-1/3 min-w-80 h-3/4 mx-auto m-2 justify-center text-center rounded-xl p-3 border-2 border-slate-300 shadow-xl shadow-black backdrop-blur-md">
                    <textarea
                        placeholder="Create note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mx-auto p-2 placeholder:text-gray-500 text-slate-950 w-full border-slate-950 border-spacing-1 rounded-md"
                    ></textarea>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-gradient-to-br from-[#3c124c] via-[#16014a] to-[#03064f] hover:bg-gradient-to-bl focus:ring-4 w-fit focus:outline-none border-stone-200 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md border-2 font-bold text-md px-5 py-2.5 text-center m-2 me-2 mb-2"
                    >
                        Save
                    </button>
                </div>

                <h3 className="h-fit w-auto bg-transparent text-teal-50 opacity-80 block text-3xl text-center justify-self-center relative m-6 my-9">
                    Your Notes
                </h3>

                <div className="sample">
                    { reminders.map((reminder) => (
                        <div
                            key={reminder._id}
                            className="notes shadow-slate-950 shadow-xl bg-gradient-to-br from-[#3c124c] via-[#16014a] to-[#03064f] rounded-lg px-3 py-4 m-4 flex items-center"
                        >
                            <div
                                className={`h-7 w-7 cursor-pointer border-slate-950 border-2 rounded-full bg-gray-700 ${
                                    reminder.complete ? "bg-gradient-to-br to-pink-700 from-amber-400" : ""
                                }`}
                                onClick={() => handleCheck(reminder._id)}
                            ></div>

                            <p
                                className={`font-semibold mx-4 flex-1 ${
                                    reminder.complete ? "line-through decoration-2" : ""
                                }`}
                            >
                                {reminder.note}
                            </p>

                            <button
                                className="deleted w-7 h-7 bg-gradient-to-br border-red-200 border-2 shadow-md font-bold from-orange-500 via-red-500 to-red-700 text-center px-2 rounded-full flex justify-center items-center"
                                onClick={() => handleDelete(reminder._id)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
