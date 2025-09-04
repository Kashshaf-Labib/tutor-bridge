import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./CreatePost.module.css";

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Form validation
  const validate = () => {
    const errs = {};
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!location.trim()) errs.location = "Location is required";
    if (!salary || isNaN(salary) || Number(salary) <= 0)
      errs.salary = "Salary must be a positive number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          subject,
          location,
          salary: Number(salary),
          requirements,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      } else {
        setApiError(data.message || "Failed to create post");
      }
    } catch (err) {
      setApiError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.createPostContainer}>
      <h1>Create New Post</h1>
      <form
        className={styles.createPostForm}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={styles.formGroup}>
          <label>
            Subject<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setErrors({ ...errors, subject: "" });
            }}
            className={errors.subject ? styles.inputError : ""}
            disabled={submitting}
          />
          {errors.subject && (
            <span className={styles.error}>{errors.subject}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>
            Location<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrors({ ...errors, location: "" });
            }}
            className={errors.location ? styles.inputError : ""}
            disabled={submitting}
          />
          {errors.location && (
            <span className={styles.error}>{errors.location}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>
            Salary (৳)<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            name="salary"
            value={salary}
            onChange={(e) => {
              setSalary(e.target.value);
              setErrors({ ...errors, salary: "" });
            }}
            className={errors.salary ? styles.inputError : ""}
            disabled={submitting}
            min="1"
          />
          {errors.salary && (
            <span className={styles.error}>{errors.salary}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Requirements</label>
          <textarea
            name="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            disabled={submitting}
            rows={3}
          />
        </div>
        {apiError && <div className={styles.apiError}>{apiError}</div>}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
