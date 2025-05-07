import React, { useState } from "react";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BusForm = () => {
    const currState = useLocation();
    const serviceType = currState.state?.service || "unknown";

    const [placeName, setplaceName] = useState("");
    const [userName, setuserName] = useState("");
    const [feedback, setfeedback] = useState("");
    const [message, setMessage] = useState("");

    const isAdd = serviceType === "removeFeedback";
    const successMessage = isAdd ? "added" : "removed";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const payload = {
            placeName,
            userName,
            feedback
        };

        try {
            const response = await axios.post(`http://localhost:5000/admin_activity/${serviceType}`, payload);

            if (response.status === 200 || response.status === 201) {
                setMessage(`Feedback ${successMessage} successfully! 🚌`);
                setplaceName("");
                setuserName("");
                setfeedback("");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div className="admin-transport-wrapper">
            {/* <Navbar /> */}
            <div className="admin_activity_wrapper">
                <form className="admin-activity-form" onSubmit={handleSubmit}>
                    <h2>{isAdd ? "Add Rickshaw" : "Remove Rickshaw"}</h2>

                    {/* Dropdown for Place Name */}
                    <div className="input-group">
                        <select
                            value={placeName}
                            onChange={(e) => setplaceName(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a place</option>
                            <option value="Nagoa">Nagoa</option>
                            <option value="Ghoghla">Ghoghla</option>
                            <option value="Jallandhar">Jallandhar</option>
                            <option value="Chakratirth">Chakratirth</option>
                            <option value="Gomtimata">Gomtimata</option>
                            <option value="DiuFort">DiuFort</option>
                            <option value="PaniKotha">PaniKotha</option>
                            <option value="Gangeshwar">Gangeshwar</option>
                        </select>
                    </div>

                    {/* User Name Input */}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="User Name"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Feedback Input */}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="User Comment"
                            value={feedback}
                            onChange={(e) => setfeedback(e.target.value)}
                            required
                        />
                    </div>

                    {/* Message Display */}
                    {message && <p className="message">{message}</p>}

                    {/* Submit Button */}
                    <button type="submit">
                        {isAdd ? "Remove Feedback" : "Remove Feedback"}
                    </button>
                </form>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default BusForm;
