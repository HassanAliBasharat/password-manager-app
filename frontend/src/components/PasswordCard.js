import React, { useState } from 'react';
import {
  FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrash, FaStar, FaRegStar,
  FaFacebook, FaUniversity, FaEnvelope, FaShoppingCart, FaBriefcase, FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from './PasswordCard.module.css';

const categoryIcons = {
  'Social Media': <FaFacebook style={{ color: '#1877f2' }} />,
  'Banking': <FaUniversity style={{ color: '#2ecc71' }} />,
  'Email': <FaEnvelope style={{ color: '#ea4335' }} />,
  'Shopping': <FaShoppingCart style={{ color: '#ff9900' }} />,
  'Work': <FaBriefcase style={{ color: '#0a66c2' }} />,
  'Other': <FaLock style={{ color: '#6c63ff' }} />,
};

const categoryColors = {
  'Social Media': '#1877f220',
  'Banking': '#2ecc7120',
  'Email': '#ea433520',
  'Shopping': '#ff990020',
  'Work': '#0a66c220',
  'Other': '#6c63ff20',
};

export default function PasswordCard({ item, onEdit, onDelete, onToggleFavorite }) {
  const [showPwd, setShowPwd] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied! 📋`);
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap} style={{ background: categoryColors[item.category] || '#6c63ff20' }}>
          {categoryIcons[item.category] || <FaLock style={{ color: '#6c63ff' }} />}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{item.title}</h3>
          <span className={styles.category}>{item.category}</span>
        </div>
        <button
          className={styles.favBtn}
          onClick={() => onToggleFavorite(item._id)}
          title="Toggle favorite"
        >
          {item.isFavorite ? <FaStar style={{ color: '#f39c12' }} /> : <FaRegStar style={{ color: '#8888aa' }} />}
        </button>
      </div>

      {(item.username || item.email) && (
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Account</span>
          <div className={styles.detailValueRow}>
            <span className={styles.detailValue}>{item.username || item.email}</span>
            <button
              className={styles.copyBtn}
              onClick={() => copyToClipboard(item.username || item.email, 'Username')}
              title="Copy username"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      <div className={styles.detail}>
        <span className={styles.detailLabel}>Password</span>
        <div className={styles.detailValueRow}>
          <span className={styles.detailValue}>
            {showPwd ? item.password : '••••••••••••'}
          </span>
          <div className={styles.pwdActions}>
            <button className={styles.copyBtn} onClick={() => setShowPwd(!showPwd)} title="Toggle visibility">
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </button>
            <button className={styles.copyBtn} onClick={() => copyToClipboard(item.password, 'Password')} title="Copy password">
              <FaCopy />
            </button>
          </div>
        </div>
      </div>

      {item.website && (
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Website</span>
          <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
            target="_blank" rel="noreferrer" className={styles.websiteLink}>
            {item.website}
          </a>
        </div>
      )}

      <div className={styles.cardFooter}>
        <button className={styles.editBtn} onClick={() => onEdit(item)}>
          <FaEdit /> Edit
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(item._id)}>
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}
