import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "../src/contexts/AuthContext";
import Login from "../src/components/Auth/Login";
import Register from "../src/components/Auth/Register";
import "./App.css";

function AppContent() {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = React.useState(true);

  if (user) {
    return (
      <div className="App">
        <h2>Welcome, {user.name}!</h2>
        <p>You are logged in as {user.role}.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", margin: "2rem" }}>
        <button onClick={() => setShowLogin(true)} style={{ marginRight: 10 }}>
          Login
        </button>
        <button onClick={() => setShowLogin(false)}>Register</button>
      </div>
      {showLogin ? <Login /> : <Register />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
