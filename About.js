import React from 'react';
import { Link } from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';
// import Footer from '../Footer/Footer';
import './About.css';

const About = () => {

  const stats = [
    { value: "20+", label: "Tourist Attractions" },
    { value: "15km", label: "Pristine Coastline" },
    { value: "450+", label: "Years of History" },
    { value: "365", label: "Sunny Days/Year" }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>Discover Diu's Rich Heritage</h1>
          <p>Where Portuguese history meets Indian coastal charm</p>
        </div>
      </section>

      <section className="about-intro">
        <div className="container">
          <div className="intro-content">
            <h2>About Diu Tourism</h2>
            <p>
              Diu Tourism is dedicated to showcasing the unique beauty and cultural heritage of this
              former Portuguese colony. Our mission is to provide authentic experiences that connect
              visitors with Diu's stunning beaches, historic landmarks, and vibrant local culture.
            </p>
            <p>
              Founded in 2010, we've helped over 50,000 visitors discover why Diu is one of India's
              best-kept secrets. Our team of local experts ensures every traveler finds their perfect
              Diu experience - whether it's exploring 16th century forts, relaxing on palm-fringed
              beaches, or savoring the island's distinctive cuisine.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <h2>Diu By The Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-item" key={index} loading="lazy">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2>Ready to Explore Diu?</h2>
          <p>Start planning your perfect island getaway today</p>
          <div className="cta-buttons">
            <Link to="/contactUs" className="cta-button primary">Contact Us</Link>
            <Link to="/places/nagoa" className="cta-button secondary">Browse Destinations</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;