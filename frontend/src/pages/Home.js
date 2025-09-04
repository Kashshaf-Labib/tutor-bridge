import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const testimonials = [
  {
    name: "Kashshaf Labib",
    text: "TutorBridge helped me ace my exams! My tutor was patient and knowledgeable.",
  },
  {
    name: "Mir Sayad",
    text: "The platform is easy to use and I found the perfect math tutor in minutes.",
  },
  {
    name: "Navid Kamal",
    text: "I love the flexibility and the quality of tutors available here.",
  },
];

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="home-new-container">
      <header className="home-hero">
        <div className="home-hero-content">
          
          <div>
            <h1>Unlock Your Potential</h1>
            <p>
              Discover expert tutors, personalized guidance, and a supportive
              learning community.
            </p>
            <Link to="/explore" className="home-cta-btn">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="home-values">
        <h2>How TutorBridge Helps You Succeed</h2>
        <div className="home-values-grid">
          <div className="home-value-card">
            <span className="home-value-icon">🌟</span>
            <h3>Personalized Matches</h3>
            <p>
              We connect you with tutors who fit your goals, schedule, and
              learning style.
            </p>
          </div>
          <div className="home-value-card">
            <span className="home-value-icon">🛡️</span>
            <h3>Trusted & Verified</h3>
            <p>
              All tutors are vetted for expertise and professionalism, so you
              can learn with confidence.
            </p>
          </div>
          <div className="home-value-card">
            <span className="home-value-icon">⚡</span>
            <h3>Fast & Flexible</h3>
            <p>
              Book sessions instantly and learn at your own pace, wherever you
              are.
            </p>
          </div>
        </div>
      </section>

      <section className="home-testimonials">
        <h2>What Our Learners Say</h2>
        <div className="home-testimonial-card">
          <button className="home-testimonial-nav" onClick={prevTestimonial}>
            ‹
          </button>
          <div>
            <p className="home-testimonial-text">
              "{testimonials[currentTestimonial].text}"
            </p>
            <span className="home-testimonial-name">
              — {testimonials[currentTestimonial].name}
            </span>
          </div>
          <button className="home-testimonial-nav" onClick={nextTestimonial}>
            ›
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
