import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "../src/contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../src/components/Auth/Login";
import Register from "../src/components/Auth/Register";
import Home from "../src/pages/Home";
import About from "../src/pages/About";
import Profile from "../src/pages/Profile";
import PostDetails from "../src/pages/PostDetails";
import Explore from "../src/pages/Explore";
import Navbar from "../src/components/Layout/Navbar";
import "./App.css";

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  // Show loading while checking authentication state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        {user && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-details/:id" element={<PostDetails />} />
          </>
        )}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
