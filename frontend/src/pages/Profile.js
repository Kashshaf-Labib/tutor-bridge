import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./Profile.module.css";
import settingsStyles from "./ProfileSettings.module.css";

const Profile = () => {
  const { user, updatePhone, updatePassword } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Profile settings state
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });

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

  // Handle phone update
  const handlePhoneUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdateMessage({ type: "", text: "" });
      await updatePhone(phone);
      setUpdateMessage({ 
        type: "success", 
        text: "Phone number updated successfully!" 
      });
    } catch (err) {
      setUpdateMessage({ 
        type: "error", 
        text: err.message || "Failed to update phone number. Please try again." 
      });
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return setUpdateMessage({ 
        type: "error", 
        text: "New passwords do not match!" 
      });
    }

    try {
      setUpdateMessage({ type: "", text: "" });
      await updatePassword(currentPassword, newPassword);
      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setUpdateMessage({ 
        type: "success", 
        text: "Password updated successfully!" 
      });
    } catch (err) {
      setUpdateMessage({ 
        type: "error", 
        text: err.message || "Failed to update password. Please try again." 
      });
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
            <button 
              className={styles.editProfileBtn}
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide Settings" : "Edit Profile"}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className={settingsStyles.profileSettings}>
            <div className={settingsStyles.settingsHeader}>
              <h2>Profile Settings</h2>
            </div>
            
            <div className={settingsStyles.settingsTabs}>
              <div 
                className={`${settingsStyles.tab} ${activeTab === "phone" ? settingsStyles.activeTab : ""}`}
                onClick={() => setActiveTab("phone")}
              >
                Update Phone
              </div>
              <div 
                className={`${settingsStyles.tab} ${activeTab === "password" ? settingsStyles.activeTab : ""}`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </div>
            </div>

            {updateMessage.text && (
              <div className={updateMessage.type === "success" ? settingsStyles.successMessage : settingsStyles.errorMessage}>
                {updateMessage.text}
              </div>
            )}

            {activeTab === "phone" && (
              <form onSubmit={handlePhoneUpdate}>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    className={settingsStyles.inputField}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Example: +8801712345678 or 01712345678"
                  />
                </div>
                <button 
                  type="submit" 
                  className={settingsStyles.updateBtn}
                  disabled={!phone || phone === user?.phone}
                >
                  Update Phone
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordUpdate}>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className={settingsStyles.inputField}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className={settingsStyles.inputField}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={settingsStyles.inputField}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className={settingsStyles.updateBtn}
                  disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
        )}

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
            <button 
              className={styles.editProfileBtn}
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide Settings" : "Edit Profile"}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className={settingsStyles.profileSettings}>
            <div className={settingsStyles.settingsHeader}>
              <h2>Profile Settings</h2>
            </div>
            
            <div className={settingsStyles.settingsTabs}>
              <div 
                className={`${settingsStyles.tab} ${activeTab === "phone" ? settingsStyles.activeTab : ""}`}
                onClick={() => setActiveTab("phone")}
              >
                Update Phone
              </div>
              <div 
                className={`${settingsStyles.tab} ${activeTab === "password" ? settingsStyles.activeTab : ""}`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </div>
            </div>

            {updateMessage.text && (
              <div className={updateMessage.type === "success" ? settingsStyles.successMessage : settingsStyles.errorMessage}>
                {updateMessage.text}
              </div>
            )}

            {activeTab === "phone" && (
              <form onSubmit={handlePhoneUpdate}>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    className={settingsStyles.inputField}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Example: +8801712345678 or 01712345678"
                  />
                </div>
                <button 
                  type="submit" 
                  className={settingsStyles.updateBtn}
                  disabled={!phone || phone === user?.phone}
                >
                  Update Phone
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordUpdate}>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className={settingsStyles.inputField}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className={settingsStyles.inputField}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={settingsStyles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={settingsStyles.inputField}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className={settingsStyles.updateBtn}
                  disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
        )}

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