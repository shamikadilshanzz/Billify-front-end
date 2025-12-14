// src/components/UserDash/components/SignatureSection.jsx

import React from 'react';
import { Upload } from 'lucide-react';
import styles from '../userDash.module.css';

export default function SignatureSection({ 
  activeTab, 
  signatureImage, 
  signatureInputRef, 
  handleSignatureUpload, 
  selectedColor 
}) {
  return (
    <div className={styles.section}>
      <h4 className={styles.signatureTitle} style={{ color: selectedColor }}>
        Signature
      </h4>
      <div 
        onClick={() => activeTab === 'Edit' && signatureInputRef.current.click()}
        className={`${styles.signatureUpload} ${
          activeTab === 'Edit' ? styles.signatureUploadEdit : styles.signatureUploadPreview
        }`}
      >
        {signatureImage ? (
          <img src={signatureImage} alt="Signature" className={styles.signatureImage} />
        ) : (
          <div className={styles.signaturePlaceholder} style={{ color: selectedColor }}>
            <Upload color='white' size={20} />
            <span>{activeTab === 'Edit' ? 'Click to upload signature' : 'No signature'}</span>
          </div>
        )}
        {activeTab === 'Edit' && (
          <input 
            ref={signatureInputRef}
            type="file" 
            accept="image/*"
            onChange={handleSignatureUpload}
            className={styles.hiddenInput}
          />
        )}
      </div>
    </div>
  );
}