import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./PostDetails.module.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectingTutor, setSelectingTutor] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch post details");
    } finally {
      setLoading(false);
    }
  };

  const selectTutor = async (tutorId) => {
    setSelectingTutor(true);
    try {
      const response = await fetch(`/api/posts/${id}/select-tutor`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tutorId })
      });

      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
        alert("Tutor selected successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to select tutor");
    } finally {
      setSelectingTutor(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      open: styles.statusOpen,
      assigned: styles.statusAssigned,
      completed: styles.statusCompleted
    };
    
    return (
      <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!post) return <div className={styles.error}>Post not found</div>;

  // Check if current user is the owner of the post
  const isOwner = user && post.student._id === user._id;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>
        <h1>Post Details</h1>
      </div>

      <div className={styles.postDetails}>
        <div className={styles.postHeader}>
          <h2>{post.subject}</h2>
          {getStatusBadge(post.status)}
        </div>

        <div className={styles.postInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Location:</strong>
              <span>{post.location}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Salary:</strong>
              <span>৳{post.salary.toLocaleString()}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Posted by:</strong>
              <span>{post.student.name}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Posted on:</strong>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {post.requirements && (
            <div className={styles.requirements}>
              <strong>Requirements:</strong>
              <p>{post.requirements}</p>
            </div>
          )}

          {post.selectedTutor && (
            <div className={styles.selectedTutor}>
              <h3>Selected Tutor</h3>
              <div className={styles.tutorCard}>
                <h4>{post.selectedTutor.name}</h4>
                <p>Email: {post.selectedTutor.email}</p>
                <p>Phone: {post.selectedTutor.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOwner && post.interestedTutors.length > 0 && (
        <div className={styles.interestedTutors}>
          <h3>Interested Tutors ({post.interestedTutors.length})</h3>
          
          {post.interestedTutors.length === 0 ? (
            <p className={styles.noTutors}>No tutors have shown interest yet.</p>
          ) : (
            <div className={styles.tutorsGrid}>
              {post.interestedTutors.map((tutor) => (
                <div key={tutor._id} className={styles.tutorCard}>
                  <h4>{tutor.name}</h4>
                  <p>Email: {tutor.email}</p>
                  <p>Phone: {tutor.phone}</p>
                  
                  {post.status === 'open' && !post.selectedTutor && (
                    <button
                      onClick={() => selectTutor(tutor._id)}
                      disabled={selectingTutor}
                      className={styles.selectBtn}
                    >
                      {selectingTutor ? "Selecting..." : "Select Tutor"}
                    </button>
                  )}
                  
                  {post.selectedTutor && post.selectedTutor._id === tutor._id && (
                    <div className={styles.selectedLabel}>✓ Selected</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isOwner && (
        <div className={styles.notOwner}>
          <p>You can only view details. This post belongs to another student.</p>
        </div>
      )}
    </div>
  );
};

export default PostDetails;