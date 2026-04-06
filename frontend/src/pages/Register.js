import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Auth.module.css';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', masterPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getStrength = (pwd) => {
    if (!pwd) return { label: '', color: '#333', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: '#e74c3c', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: '#f39c12', width: '40%' };
    if (score <= 3) return { label: 'Good', color: '#3498db', width: '65%' };
    if (score <= 4) return { label: 'Strong', color: '#2ecc71', width: '85%' };
    return { label: 'Very Strong', color: '#27ae60', width: '100%' };
  };

  const strength = getStrength(formData.masterPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.masterPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (formData.masterPassword.length < 8) {
      return toast.error('Master password must be at least 8 characters');
    }
    setLoading(true);
    try {
      const res = await register({
        username: formData.username,
        email: formData.email,
        masterPassword: formData.masterPassword,
      });
      loginUser(res.data.token, res.data.user);
      toast.success('Vault created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <FaShieldAlt size={32} color="#6c63ff" />
        </div>
        <h1 className={styles.title}>Create Your Vault</h1>
        <p className={styles.subtitle}>One master password to rule them all</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

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
                placeholder="Min 8 characters"
                value={formData.masterPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeBtn}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.masterPassword && (
              <div className={styles.strengthBar}>
                <div className={styles.strengthFill} style={{ width: strength.width, background: strength.color }} />
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Confirm Master Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat master password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating Vault...' : 'Create Vault 🛡️'}
          </button>
        </form>

        <p className={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
