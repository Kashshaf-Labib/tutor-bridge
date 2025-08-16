import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Tutor</h1>
          <p>Connect with qualified tutors for personalized learning experiences</p>
          <div className="cta-buttons">
            <Link to="/explore" className="cta-primary">Find a Tutor</Link>
            <Link to="/register" className="cta-secondary">Become a Tutor</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose TutorBridge?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Expert Tutors</h3>
            <p>Connect with verified, experienced tutors across various subjects</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Perfect Match</h3>
            <p>Find tutors that match your learning style and requirements</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable Pricing</h3>
            <p>Competitive rates with transparent pricing structure</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Safe & Secure</h3>
            <p>Verified profiles and secure payment systems</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>1000+</h3>
          <p>Active Tutors</p>
        </div>
        <div className="stat-card">
          <h3>5000+</h3>
          <p>Happy Students</p>
        </div>
        <div className="stat-card">
          <h3>15+</h3>
          <p>Subjects</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

