import { useState, useEffect } from "react";
import "./AdminContactUs.css";

const LocalcontactUs = () => {
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = () => {
    fetch("http://localhost:5000/admin_activity/fetchContactUs", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContactData(data);
        } else if (data.data) {
          setContactData(data.data);
        } else {
          console.error("Unexpected API response:", data);
        }
      })
      .catch((error) =>
        console.error("Error fetching contact details:", error)
      );
  };

  const removeAll = () => {
    // Show confirmation dialog before proceeding with the deletion
    if (window.confirm("Are you sure you want to remove all contact submissions?")) {
      fetch("http://localhost:5000/admin_activity/removeAllContactUs", {
        method: "POST",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("All removed:", result);
          fetchContactData(); // Refresh data
        })
        .catch((err) => console.error("Error removing all:", err));
    }
  };
  
  const removeOne = (user_name, email) => {
    // Show confirmation dialog before proceeding with the deletion
    if (window.confirm(`Are you sure you want to remove the contact submission from ${user_name}?`)) {
      fetch("http://localhost:5000/admin_activity/removeOneContactUs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ user_name, email }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("Removed one:", result);
          fetchContactData(); // Refresh data
        })
        .catch((err) => console.error("Error removing one:", err));
    }
  };
  

  return (
    <div className="contactUs-page-wrapper">
      <div className="contactUs-details-container">
        <h2>User Suggestions</h2>
        {contactData.length > 0 ? (
          <div className="table-wrapper">
            <table className="contactUs-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>
                    <button
                      className="adminContactusRemoveAllbtn"
                      onClick={removeAll}
                    >
                      Remove ALL
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {contactData.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.user_name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.subject}</td>
                    <td>{entry.message}</td>
                    <td>
                      <button
                        className="adminContactusRemoveOnebtn"
                        onClick={() => removeOne(entry.user_name, entry.email)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default LocalcontactUs;
