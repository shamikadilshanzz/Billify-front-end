// src/components/UserDash/components/InvoiceSection.jsx

import React from 'react';
import styles from '../userDash.module.css';

export default function InvoiceSection({ 
  title, 
  activeTab, 
  formData = {}, 
  updateFormData, 
  selectedColor, 
  isMobile,
  fields = [] 
}) {
  

  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
        {title}
      </h3>
      
      {activeTab === 'Edit' ? (
        <div className={`${styles.formGrid} ${isMobile ? styles.formGridMobile : ''}`}>
          {fields.map(field => (
            <input 
              key={field.key}
              type={field.type || 'text'}
              value={formData[field.key] || ''} // Add fallback
              onChange={(e) => updateFormData(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={styles.input}
            />
          ))}
        </div>
      ) : (
        <div className={styles.sectionContent}>
          {fields.map(field => (
            <p key={field.key} className={styles.sectionText}>
              {formData[field.key]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}