import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to TutorBridge</h1>
      <p>Your trusted platform to connect students and tutors in Bangladesh.</p>
      <div className="features">
        <div className="feature-card">
          <h3>Find the Best Tutors</h3>
          <p>
            Search and connect with top-rated tutors for any subject or skill.
          </p>
        </div>
        <div className="feature-card">
          <h3>Post Your Tuition</h3>
          <p>
            Students can easily post tuition requirements and get matched
            instantly.
          </p>
        </div>
        <div className="feature-card">
          <h3>Secure Payments</h3>
          <p>
            Pay safely through integrated payment gateways like bKash & Nagad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
