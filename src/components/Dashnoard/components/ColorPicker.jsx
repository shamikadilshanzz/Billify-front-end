// src/components/UserDash/components/ColorPicker.jsx

import React from 'react';
import styles from '../userDash.module.css';
import { COLORS } from '../utils/constants';

export default function ColorPicker({ 
  selectedColor, 
  setSelectedColor, 
  discountType, 
  setDiscountType, 
  discountValue, 
  setDiscountValue 
}) {
  return (
    <div className={styles.sidebar}>
      {/* Template Color Picker */}
      <div className={styles.sidebarPanel}>
        <h4 className={styles.sidebarTitle}>DOCUMENT COLOR</h4>
        <p className={styles.sidebarText}>Click a color to change the top border</p>
        <div className={styles.colorGrid}>
          {COLORS.map((color) => (
            <div 
              key={color} 
              onClick={() => setSelectedColor(color)}
              className={`${styles.colorSwatch} ${
                selectedColor === color ? styles.colorSwatchActive : ''
              }`}
              style={{ 
                backgroundColor: color,
                boxShadow: selectedColor === color ? `0 0 15px ${color}` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Discount */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
          Discount
        </h3>
        <div className={styles.formGrid}>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className={styles.select}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="price">Fixed Price (Rs)</option>
          </select>
          <input
            type="number"
            min="0"
            value={discountValue}
            onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
            className={styles.input}
            placeholder={
              discountType === "percentage"
                ? "Enter % (ex: 10)"
                : "Enter price (ex: 500)"
            }
          />
        </div>
      </div>
    </div>
  );
}