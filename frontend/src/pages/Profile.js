import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudentPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts/my-posts", {
        headers: {
          "Authorization": `Bearer ${user.token}`,
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
  }, [user.token]);

  const fetchTutorInterestedPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts/my-interests", {
        headers: {
          "Authorization": `Bearer ${user.token}`,
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
      setError("Failed to fetch interested posts");
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    if (user?.role === "Student") {
      fetchStudentPosts();
    } else if (user?.role === "Tutor") {
      fetchTutorInterestedPosts();
    }
  }, [user?.role, fetchStudentPosts, fetchTutorInterestedPosts]);

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

  const getTutorStatusForPost = (post) => {
    if (post.selectedTutor && post.selectedTutor._id === user._id) {
      return { text: "✓ You are selected", className: styles.selectedStatus };
    } else if (post.selectedTutor) {
      return { text: "Another tutor selected", className: styles.rejectedStatus };
    } else {
      return { text: "Pending selection", className: styles.pendingStatus };
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  // Student Profile
  if (user?.role === "Student") {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h1>Student Profile</h1>
          <div className={styles.userInfo}>
            <h2>Welcome, {user?.name}</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        <div className={styles.postsSection}>
          <div className={styles.sectionHeader}>
            <h2>My Posts ({posts.length})</h2>
            <Link to="/create-post" className={styles.createBtn}>
              Create New Post
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {posts.length === 0 ? (
            <div className={styles.noPosts}>
              <p>You haven't created any posts yet.</p>
              <Link to="/create-post" className={styles.createBtn}>
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <h3>{post.subject}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  
                  <div className={styles.postInfo}>
                    <p><strong>Location:</strong> {post.location}</p>
                    <p><strong>Salary:</strong> ৳{post.salary.toLocaleString()}</p>
                    <p><strong>Interested Tutors:</strong> {post.interestedTutors.length}</p>
                    {post.selectedTutor && (
                      <p><strong>Selected Tutor:</strong> {post.selectedTutor.name}</p>
                    )}
                  </div>

                  <div className={styles.postActions}>
                    <Link 
                      to={`/post-details/${post._id}`} 
                      className={styles.detailsBtn}
                    >
                      View Details
                    </Link>
                    {post.status === 'open' && (
                      <Link 
                        to={`/edit-post/${post._id}`} 
                        className={styles.editBtn}
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tutor Profile
  if (user?.role === "Tutor") {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h1>Tutor Profile</h1>
          <div className={styles.userInfo}>
            <h2>Welcome, {user?.name}</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        <div className={styles.postsSection}>
          <div className={styles.sectionHeader}>
            <h2>Posts I'm Interested In ({posts.length})</h2>
            <Link to="/explore" className={styles.createBtn}>
              Explore More Posts
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {posts.length === 0 ? (
            <div className={styles.noPosts}>
              <p>You haven't shown interest in any posts yet.</p>
              <Link to="/explore" className={styles.createBtn}>
                Explore Posts
              </Link>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => {
                const tutorStatus = getTutorStatusForPost(post);
                return (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <h3>{post.subject}</h3>
                      {getStatusBadge(post.status)}
                    </div>
                    
                    <div className={styles.postInfo}>
                      <p><strong>Location:</strong> {post.location}</p>
                      <p><strong>Salary:</strong> ৳{post.salary.toLocaleString()}</p>
                      <p><strong>Posted by:</strong> {post.student.name}</p>
                      <p><strong>Total Interested:</strong> {post.interestedTutors.length}</p>
                      
                      <div className={`${styles.tutorStatus} ${tutorStatus.className}`}>
                        <strong>{tutorStatus.text}</strong>
                      </div>
                    </div>

                    <div className={styles.postActions}>
                      <Link 
                        to={`/post-details/${post._id}`} 
                        className={styles.detailsBtn}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className={styles.error}>Invalid user role</div>;
};

export default Profile;