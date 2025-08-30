import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./Explore.module.css";

const Explore = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    minSalary: "",
    maxSalary: ""
  });

  // Fetch all posts with filters
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build query string
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.location) params.append('location', filters.location);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
      
      const response = await fetch(`/api/posts?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  // Express interest in a post (Tutor only)
  const expressInterest = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/interested`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the post in the state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, interestedTutors: [...post.interestedTutors, user._id] }
              : post
          )
        );
        alert("Interest expressed successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to express interest");
    }
  };

  // Check if tutor has already expressed interest
  const hasExpressedInterest = (post) => {
    return post.interestedTutors.includes(user?._id);
  };

  // Load posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [user]);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Explore Tutoring Posts</h1>
        {user?.role === "Student" && (
          <p>Browse available tutoring opportunities</p>
        )}
        {user?.role === "Tutor" && (
          <p>Find students looking for tutors in your expertise</p>
        )}
      </div>

      {/* Filter Section */}
      <div className={styles.filters}>
        <form onSubmit={handleFilterSubmit}>
          <div className={styles.filterGrid}>
            <input
              type="text"
              name="subject"
              placeholder="Subject (e.g., Math, Physics)"
              value={filters.subject}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
            <input
              type="text"
              name="location"
              placeholder="Location (e.g., Dhaka, Chittagong)"
              value={filters.location}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
            <input
              type="number"
              name="minSalary"
              placeholder="Min Salary"
              value={filters.minSalary}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
            <input
              type="number"
              name="maxSalary"
              placeholder="Max Salary"
              value={filters.maxSalary}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
          </div>
          <button type="submit" className={styles.filterBtn}>
            Apply Filters
          </button>
        </form>
      </div>

      {/* Loading and Error States */}
      {loading && <div className={styles.loading}>Loading posts...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {/* Posts will be added in next step */}
    </div>
  );
};

export default Explore;
