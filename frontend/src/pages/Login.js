import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Auth.module.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', masterPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      loginUser(res.data.token, res.data.user);
      toast.success('Welcome back! 🔐');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <FaLock size={32} color="#6c63ff" />
        </div>
        <h1 className={styles.title}>SecureVault</h1>
        <p className={styles.subtitle}>Enter your master password to unlock</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Master Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="masterPassword"
                placeholder="Your master password"
                value={formData.masterPassword}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeBtn}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Unlocking...' : 'Unlock Vault 🔓'}
          </button>
        </form>

        <p className={styles.link}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
