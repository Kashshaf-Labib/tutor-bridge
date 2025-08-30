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

  // We'll implement these functions in the next steps
  
  return (
    <div className={styles.container}>
      <h1>Explore Posts</h1>
      {/* Content will be added in next steps */}
    </div>
  );
};

export default Explore;
