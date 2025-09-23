import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Achivements.css";

const API_BASE_URL = "http://localhost:8000/api";

const Achivements = () => {
    const [Achives, setAchives] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // ✅ Fetch Achievements from API
    const fetchAchievements = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Achivementget`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with actual token
                },
            });
            setAchives(response.data);
        } catch (error) {
            console.error("Error fetching achievements:", error);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    // ✅ Add Achievement
    const addAchive = async () => {
        if (inputValue.trim()) {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/Achivementadd`,
                    { text: inputValue },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setAchives([...Achives, response.data]); // Add new achievement to state
                setInputValue("");
            } catch (error) {
                console.error("Error adding achievement:", error);
            }
        }
    };

    // ✅ Delete Achievement
    const removeAchive = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setAchives(Achives.filter((achive) => achive._id !== id)); // Remove from UI
        } catch (error) {
            console.error("Error deleting achievement:", error);
        }
    };

    return (
        <div className="achivement-container">
            <div className="achivements">
                <h1 className="achive-head"><i className="fa-solid fa-trophy" id="achive-font"></i>&nbsp;&nbsp;Achievements</h1>
                <div className="achives-input">
                    <input
                        type="text"
                        className="achive-control"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add your achievements here"
                    />
                    <div className="achives-btn">
                        <button className="achive-btn" onClick={addAchive}>
                            Add
                        </button>
                    </div>
                </div>
                <div className="achives-align">
                    <ul className="achives-output">
                        {Achives.map((task) => (
                            <div className="achive-show" key={task._id}>
                                <li id="achives-show">{task.text}</li>
                                <div className="achive-delete">
                                    <button className="achive-del" onClick={() => removeAchive(task._id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Achivements;
