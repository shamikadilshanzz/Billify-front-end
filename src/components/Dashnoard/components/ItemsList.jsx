// src/components/UserDash/components/ItemsList.jsx

import React from 'react';
import styles from '../userDash.module.css';

export default function ItemsList({ 
  items, 
  activeTab, 
  updateItem, 
  deleteItem, 
  addItem, 
  selectedColor, 
  isMobile 
}) {
  return (
    <div className={styles.itemsContainer}>
      {!isMobile && (
        <div className={styles.itemsHeader}>
          <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>
            DESCRIPTION
          </div>
          <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>
            RATE
          </div>
          <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>
            QTY
          </div>
          <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>
            AMOUNT
          </div>
        </div>
      )}
      
      {items.map((item) => (
        <div key={item.id} className={`${styles.itemRow} ${isMobile ? styles.itemRowMobile : ''}`}>
          <div>
            {isMobile && (
              <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>
                DESCRIPTION
              </div>
            )}
            {activeTab === 'Edit' ? (
              <>
                <input 
                  type="text" 
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className={styles.itemDescriptionInput}
                />
                <textarea 
                  value={item.details}
                  onChange={(e) => updateItem(item.id, 'details', e.target.value)}
                  className={styles.itemDetailsTextarea}
                  placeholder="Additional details"
                />
              </>
            ) : (
              <>
                <p className={styles.itemDescription}>{item.description}</p>
                {item.details && <p className={styles.itemDetails}>{item.details}</p>}
              </>
            )}
          </div>
          
          <div className={styles.itemField}>
            {isMobile && (
              <div className={styles.itemFieldLabel} style={{ color: selectedColor }}>
                RATE:
              </div>
            )}
            {activeTab === 'Edit' ? (
              <input 
                type="number" 
                value={item.rate}
                onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                className={styles.itemFieldInput}
              />
            ) : (
              <span>Rs. {item.rate.toFixed(1)}</span>
            )}
          </div>
          
          <div className={styles.itemField}>
            {isMobile && (
              <div className={styles.itemFieldLabel} style={{ color: selectedColor }}>
                QTY:
              </div>
            )}
            {activeTab === 'Edit' ? (
              <input 
                type="number" 
                value={item.qty}
                onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                className={styles.itemFieldInput}
              />
            ) : (
              <span>{item.qty}</span>
            )}
          </div>
          
          <div 
            className={`${styles.itemAmount} ${isMobile ? styles.itemAmountMobile : ''}`} 
            style={{ color: selectedColor }}
          >
            {isMobile && (
              <div 
                className={`${styles.itemFieldLabel} ${styles.itemFieldLabelAmount}`} 
                style={{ color: selectedColor }}
              >
                AMOUNT:
              </div>
            )}
            Rs. {item.amount.toFixed(1)}
          </div>
          
          {activeTab === 'Edit' && (
            <button 
              onClick={() => deleteItem(item.id)} 
              className={styles.deleteBtn}
            >
              Delete
            </button>
          )}
        </div>
      ))}
      
      {activeTab === 'Edit' && (
        <button 
          onClick={addItem} 
          className={styles.addItemButton} 
          style={{ color: selectedColor }}
        >
          +
        </button>
      )}
    </div>
  );
}