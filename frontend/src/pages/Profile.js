import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
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

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Student Profile</h1>
        <div className={styles.userInfo}>
          <h2>Welcome, {user?.name}</h2>
          <p>{user?.email}</p>
          <p>{user?.phone}</p>
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
};

export default Profile;