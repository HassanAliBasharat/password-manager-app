import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaSignOutAlt, FaShieldAlt, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getPasswords, createPassword, updatePassword, deletePassword, toggleFavorite } from '../utils/api';
import PasswordCard from '../components/PasswordCard';
import PasswordModal from '../components/PasswordModal';
import styles from './Dashboard.module.css';

const CATEGORIES = ['All', 'Social Media', 'Banking', 'Email', 'Shopping', 'Work', 'Other'];

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPasswords = useCallback(async () => {
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search) params.search = search;
      const res = await getPasswords(params);
      setPasswords(res.data);
    } catch (err) {
      toast.error('Failed to load passwords');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    const debounce = setTimeout(fetchPasswords, 300);
    return () => clearTimeout(debounce);
  }, [fetchPasswords]);

  const handleSave = async (formData) => {
    try {
      if (editData) {
        const res = await updatePassword(editData._id, formData);
        setPasswords(passwords.map(p => p._id === editData._id ? res.data : p));
        toast.success('Password updated! ✅');
      } else {
        const res = await createPassword(formData);
        setPasswords([res.data, ...passwords]);
        toast.success('Password saved! 🔐');
      }
      setModalOpen(false);
      setEditData(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save password');
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };

  const handleDelete = async () => {
    try {
      await deletePassword(deleteConfirm);
      setPasswords(passwords.filter(p => p._id !== deleteConfirm));
      toast.success('Password deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await toggleFavorite(id);
      setPasswords(passwords.map(p => p._id === id ? { ...p, isFavorite: res.data.isFavorite } : p));
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const displayed = showFavoritesOnly ? passwords.filter(p => p.isFavorite) : passwords;

  const stats = {
    total: passwords.length,
    social: passwords.filter(p => p.category === 'Social Media').length,
    banking: passwords.filter(p => p.category === 'Banking').length,
    favorites: passwords.filter(p => p.isFavorite).length,
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <FaShieldAlt size={22} color="#6c63ff" />
            <span>SecureVault</span>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
            <div>
              <div className={styles.userName}>{user?.username}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Categories</p>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.navItem} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
            >
              {cat}
              <span className={styles.count}>
                {cat === 'All' ? passwords.length : passwords.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
          <div className={styles.divider} />
          <button
            className={`${styles.navItem} ${showFavoritesOnly ? styles.active : ''}`}
            onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setActiveCategory('All'); }}
          >
            <FaStar style={{ color: '#f39c12', marginRight: 4 }} /> Favorites
            <span className={styles.count}>{stats.favorites}</span>
          </button>
        </nav>

        <button className={styles.logoutBtn} onClick={logoutUser}>
          <FaSignOutAlt /> Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>
              {showFavoritesOnly ? '⭐ Favorites' : activeCategory === 'All' ? 'All Passwords' : activeCategory}
            </h1>
            <p className={styles.pageSubtitle}>{displayed.length} item{displayed.length !== 1 ? 's' : ''} stored securely</p>
          </div>
          <button className={styles.addBtn} onClick={() => { setEditData(null); setModalOpen(true); }}>
            <FaPlus /> Add Password
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.total}</span>
            <span className={styles.statLabel}>Total Passwords</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: '#1877f2' }}>{stats.social}</span>
            <span className={styles.statLabel}>Social Media</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: '#2ecc71' }}>{stats.banking}</span>
            <span className={styles.statLabel}>Banking</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: '#f39c12' }}>{stats.favorites}</span>
            <span className={styles.statLabel}>Favorites</span>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            placeholder="Search by title, username, or website..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.empty}>Loading your vault...</div>
        ) : displayed.length === 0 ? (
          <div className={styles.empty}>
            <FaShieldAlt size={48} color="#2d2d50" />
            <p>No passwords found</p>
            <button className={styles.addBtn} onClick={() => { setEditData(null); setModalOpen(true); }}>
              <FaPlus /> Add your first password
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {displayed.map(item => (
              <PasswordCard
                key={item._id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <PasswordModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        editData={editData}
      />

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <h3>Delete Password?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button onClick={() => setDeleteConfirm(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleDelete} className={styles.deleteConfirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
