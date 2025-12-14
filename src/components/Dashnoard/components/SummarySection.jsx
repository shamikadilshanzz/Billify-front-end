// src/components/UserDash/components/SummarySection.jsx

import React from 'react';
import styles from '../userDash.module.css';

export default function SummarySection({ 
  subtotal, 
  discountPrice, 
  total, 
  balanceDue, 
  selectedColor 
}) {
  return (
    <div className={styles.summary} style={{ borderTop: `3px solid ${selectedColor}` }}>
      <div className={styles.summaryRow}>
        <span>Subtotal:</span>
        <span>Rs. {subtotal.toFixed(1)}</span>
      </div>
      
      <div className={styles.summaryRow}>
        <span>Discount:</span>
        <span>Rs. {discountPrice.toFixed(1)}</span>
      </div>
      
      <div className={styles.summaryRow}>
        <span>Total:</span>
        <span>Rs. {total.toFixed(1)}</span>
      </div>
      
      <div className={styles.summaryTotal} style={{ color: selectedColor }}>
        <span>Balance Due:</span>
        <span>Rs. {balanceDue.toFixed(2)}</span>
      </div>
    </div>
  );
}