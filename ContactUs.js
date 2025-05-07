import React, { useState } from 'react';
import './ContactUs.css';
import Maps from '../Places/Maps';

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/admin_activity/contactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Message sent successfully!');
        setFormData({
          user_name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Something went wrong: ' + error.message);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contactUs-main-container">
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="contactUs-container">
          <div className="form-contactUs-container">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="user_name">Your Name</label>
                <input
                  type="text"
                  id="user_name"
                  placeholder="Enter your name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contactUs-submit-button">Send Message</button>
            </form>
          </div>
          <div className="map-contactUs-container">
            <Maps />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import './ContactUs.css';
// import Maps from '../Places/Maps';

// const Contact = () => {
//   const contactMethods = [
//     {
//       icon: "📞",
//       title: "Phone",
//       details: "+91 9876543210",
//       action: "Call us"
//     },
//     {
//       icon: "✉️",
//       title: "Email",
//       details: "info@diutourism.com",
//       action: "Send message"
//     },
//     {
//       icon: "🏢",
//       title: "Office",
//       details: "Tourism Complex, Near Nagoa Beach, Diu - 362520",
//       action: "Get directions"
//     }
//   ];

//   return (
//     <div className="contact-page">
//       {/* Hero Section */}
//       <section className="contactUs-main-container">
//       </section>

//       {/* Contact Form */}
//       <section className="contact-form-section">
//         <div className="contactUs-container">
//           <div className="form-contactUs-container">
//             <h2>Send Us a Message</h2>
//             <form className="contact-form">
//               <div className="form-group">
//                 <label htmlFor="name">Your Name</label>
//                 <input type="text" id="name" placeholder="Enter your name" />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email Address</label>
//                 <input type="email" id="email" placeholder="Enter your email" />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="subject">Subject</label>
//                 <input type="text" id="subject" placeholder="What's this about?" />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="message">Your Message</label>
//                 <textarea id="message" rows="5" placeholder="Type your message here..."></textarea>
//               </div>

//               <button type="submit" className="submit-button">Send Message</button>
//             </form>
//           </div>

//           <div className="map-contactUs-container">
//             <Maps />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Contact;