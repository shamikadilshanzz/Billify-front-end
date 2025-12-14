// src/components/UserDash/components/PhotosSection.jsx

import React from 'react';
import { Camera } from 'lucide-react';
import styles from '../userDash.module.css';

export default function PhotosSection({ 
  activeTab, 
  photos, 
  removePhoto, 
  photosInputRef, 
  handlePhotosUpload, 
  selectedColor, 
  isMobile 
}) {
  return (
    <div className={styles.section}>
      <h4 className={styles.signatureTitle} style={{ color: selectedColor }}>
        Photos
      </h4>
      
      {photos.length > 0 && (
        <div className={`${styles.photosGrid} ${isMobile ? styles.photosGridMobile : ''}`}>
          {photos.map((photo) => (
            <div key={photo.id} className={styles.photoItem}>
              <img src={photo.url} alt="Photo" className={styles.photoImage} />
              {activeTab === 'Edit' && (
                <button 
                  onClick={() => removePhoto(photo.id)} 
                  className={styles.photoRemoveButton}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'Edit' && (
        <div 
          onClick={() => photosInputRef.current.click()} 
          className={styles.photosUpload} 
          style={{ color: selectedColor }}
        >
          <Camera color='white' size={32} />
          <span>Click to add photos</span>
          <input 
            ref={photosInputRef}
            type="file" 
            accept="image/*"
            multiple
            onChange={handlePhotosUpload}
            className={styles.hiddenInput}
          />
        </div>
      )}
    </div>
  );
}