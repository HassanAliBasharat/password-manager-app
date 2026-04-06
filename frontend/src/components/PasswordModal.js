import React, { useState, useEffect } from 'react';
import { FaTimes, FaEye, FaEyeSlash, FaDice } from 'react-icons/fa';
import styles from './PasswordModal.module.css';

const CATEGORIES = ['Social Media', 'Banking', 'Email', 'Shopping', 'Work', 'Other'];

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}';
  let pwd = '';
  for (let i = 0; i < 16; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  return pwd;
};

export default function PasswordModal({ isOpen, onClose, onSave, editData }) {
  const [formData, setFormData] = useState({
    title: '', username: '', email: '', password: '',
    website: '', category: 'Other', notes: '', isFavorite: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        username: editData.username || '',
        email: editData.email || '',
        password: editData.password || '',
        website: editData.website || '',
        category: editData.category || 'Other',
        notes: editData.notes || '',
        isFavorite: editData.isFavorite || false,
      });
    } else {
      setFormData({ title: '', username: '', email: '', password: '', website: '', category: 'Other', notes: '', isFavorite: false });
    }
    setShowPassword(false);
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.password) return;
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const getStrength = (pwd) => {
    if (!pwd) return { label: '', color: '#333', pct: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { label: 'Weak', color: '#e74c3c', pct: 20 },
      { label: 'Weak', color: '#e74c3c', pct: 20 },
      { label: 'Fair', color: '#f39c12', pct: 45 },
      { label: 'Good', color: '#3498db', pct: 65 },
      { label: 'Strong', color: '#2ecc71', pct: 85 },
      { label: 'Very Strong', color: '#27ae60', pct: 100 },
    ];
    return levels[score];
  };

  const strength = getStrength(formData.password);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{editData ? 'Edit Password' : 'Add New Password'}</h2>
          <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Title *</label>
              <input name="title" placeholder="e.g., Facebook, Chase Bank" value={formData.title} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Username / Handle</label>
              <input name="username" placeholder="@username" value={formData.username} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" name="email" placeholder="account@email.com" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Password *</label>
            <div className={styles.passwordRow}>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeBtn}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="button"
                className={styles.generateBtn}
                title="Generate password"
                onClick={() => setFormData({ ...formData, password: generatePassword() })}
              >
                <FaDice /> Generate
              </button>
            </div>
            {formData.password && (
              <div className={styles.strengthBar}>
                <div className={styles.strengthTrack}>
                  <div className={styles.strengthFill} style={{ width: `${strength.pct}%`, background: strength.color }} />
                </div>
                <span className={styles.strengthLabel} style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Website URL</label>
            <input name="website" placeholder="https://facebook.com" value={formData.website} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Notes</label>
            <textarea name="notes" placeholder="Optional notes..." value={formData.notes} onChange={handleChange} rows={3} />
          </div>

          <div className={styles.favoriteRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="isFavorite" checked={formData.isFavorite} onChange={handleChange} />
              <span>Mark as Favorite ⭐</span>
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : editData ? 'Update Password' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
