// src/components/UserDash/components/InvoiceHeader.jsx

import React from 'react';
import { Camera } from 'lucide-react';
import styles from '../userDash.module.css';

export default function InvoiceHeader({ 
  activeTab, 
  formData, 
  updateFormData, 
  logoImage, 
  logoInputRef, 
  handleLogoUpload,
  selectedColor,
  isMobile 
}) {
  return (
    <div className={`${styles.header} ${isMobile ? styles.headerMobile : ''}`}>
      {activeTab === 'Edit' ? (
        <input 
          type="text" 
          value={formData.invoiceTitle}
          onChange={(e) => updateFormData('invoiceTitle', e.target.value)}
          className={`${styles.invoiceTitleInput} ${isMobile ? styles.invoiceTitleInputMobile : ''}`}
        />
      ) : (
        <h1 className={`${styles.invoiceTitle} ${isMobile ? styles.invoiceTitleMobile : ''}`}>
          {formData.invoiceTitle}
        </h1>
      )}
      
      <div 
        onClick={() => activeTab === 'Edit' && logoInputRef.current.click()}
        className={`${styles.logoContainer} ${isMobile ? styles.logoContainerMobile : ''} ${activeTab !== 'Edit' ? styles.logoContainerPreview : ''}`}
        style={{ color: selectedColor }}
      >
        {logoImage ? (
          <img src={logoImage} alt="Logo" className={styles.logoImage} />
        ) : (
          <div className={styles.logoPlaceholder}>
            <Camera color='white' size={isMobile ? 20 : 24} />
            <span className={`${styles.logoText} ${isMobile ? styles.logoTextMobile : ''}`}>
              Logo
            </span>
          </div>
        )}
        {activeTab === 'Edit' && (
          <input 
            ref={logoInputRef}
            type="file" 
            accept="image/*"
            onChange={handleLogoUpload}
            className={styles.hiddenInput}
          />
        )}
      </div>
    </div>
  );
}