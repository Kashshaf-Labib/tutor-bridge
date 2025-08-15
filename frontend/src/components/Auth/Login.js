import React, { useState, useContext } from "react";
import styles from "./Login.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className={styles.button} type="submit">
          Login
        </button>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <span>Don't have an account? </span>
          <Link
            to="/register"
            style={{
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              background: "none",
              border: "none",
            }}
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;