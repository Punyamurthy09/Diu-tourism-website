import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./AddRemovePublicToilets.css";

const BusForm = () => {
  const currState = useLocation();
  const serviceType = currState.state?.service || "unknown";

  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [message, setMessage] = useState("");

  const isAdd = serviceType === "addPublicToilets";
  const successMessage = isAdd ? "added" : "removed";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!isAdd && !window.confirm("Are you sure you want to remove this public toilet?")) {
      return;
    }

    // Payload depends on action
    const payload = isAdd ? { name, lat, lng } : { name };

    try {
      const response = await axios.post(
        `http://localhost:5000/admin_activity/${serviceType}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setMessage(`Public Toilet ${successMessage} successfully! 🚻`);
        setName("");
        setLat("");
        setLng("");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="admin-transport-wrapper">
      <div className="admin_activity_wrapper">
        <form className="admin-activity-form" onSubmit={handleSubmit}>
          <h2>{isAdd ? "Add Public Toilet" : "Remove Public Toilet"}</h2>

          <div className="input-group">
            <input
              name="adminPublicToiletName"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {isAdd && (
            <>
              <div className="input-group">
                <input
                  name="adminPublicToiletLat"
                  type="number"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  name="adminPublicToiletLng"
                  type="number"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {message && <p className="message">{message}</p>}

          <button type="submit" className="adminPublicToiletSubmit">
            {isAdd ? "Add Public Toilet" : "Remove Public Toilet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusForm;
