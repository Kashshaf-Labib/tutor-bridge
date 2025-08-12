import React, { useState, useContext } from "react";
import styles from "./Register.module.css";
import { AuthContext } from "../../contexts/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.role,
        form.phone
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Register</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <select
          className={styles.input}
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="Student">Student</option>
          <option value="Tutor">Tutor</option>
        </select>
        <input
          className={styles.input}
          type="text"
          name="phone"
          placeholder="Phone (+8801XXXXXXXXX)"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <button className={styles.button} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
