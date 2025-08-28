import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add this function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.token && !isTokenExpired(userData.token)) {
          setUser(userData);
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data);
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      throw new Error(data.message);
    }
  };

  const register = async (name, email, password, role, phone) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, phone }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
