// src/components/UserDash/components/NotesSection.jsx

import React from 'react';
import styles from '../userDash.module.css';

export default function NotesSection({ 
  activeTab, 
  formData, 
  updateFormData, 
  selectedColor 
}) {
  if (activeTab === 'Edit') {
    return (
      <div className={styles.section}>
        <textarea 
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          className={styles.textarea}
          placeholder="Notes - any relevant information not covered, additional terms and conditions"
        />
      </div>
    );
  }

  if (formData.notes) {
    return (
      <div className={styles.notesContainer}>
        <h4 className={styles.notesTitle} style={{ color: selectedColor }}>
          Notes
        </h4>
        <p className={styles.notesText}>{formData.notes}</p>
      </div>
    );
  }

  return null;
}