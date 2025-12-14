// src/components/UserDash/components/UpcomingItems.jsx

import React from 'react';
import styles from '../userDash.module.css';

export default function UpcomingItems({
  activeTab,
  upcomingTitle,
  upcomingDescription,
  upcomingItems,
  upcomingError,
  packagePrice,
  total,
  remainingBeforeUpcoming,
  upcomingTotal,
  remainingAfterUpcoming,
  availableForUpcoming,
  updateUpcomingItem,
  deleteUpcomingItem,
  addUpcomingItem,
  selectedColor,
  isMobile
}) {
  if (activeTab === 'Preview') {
    return (
      <div>
        {availableForUpcoming > 0 && upcomingItems.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: selectedColor, marginBottom: 10, fontWeight: "600" }}>
              Upcoming Items
            </h3>
            {upcomingItems.map(item => (
              <div 
                key={item.id}
                className={`${styles.itemRow} ${isMobile ? styles.itemRowMobile : ''}`}
                style={{ marginBottom: "10px" }}
              >
                <div>
                  {isMobile && (
                    <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>
                      DESCRIPTION
                    </div>
                  )}
                  <p className={styles.itemDescription}>{item.desc}</p>
                  {item.details && <p className={styles.itemDetails}>{item.details}</p>}
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
                  Rs. {item.price.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
            {upcomingTitle}
          </h3>
          <div className={styles.sectionContent}>
            <p className={styles.sectionTextM}>Full Package: Rs. {parseFloat(packagePrice||0).toFixed(1)}</p>
            <p className={styles.sectionTextM}>Paid Now (Items Total): Rs. {parseFloat(total||0).toFixed(1)}</p>
            <p className={styles.sectionTextM}>Remaining (before upcoming): Rs. {Math.max(0, parseFloat(remainingBeforeUpcoming||0)).toFixed(1)}</p>
            <p className={styles.sectionTextM}>Upcoming Items Total: Rs. {parseFloat(upcomingTotal||0).toFixed(1)}</p>
            <p className={styles.sectionTextM}>Remaining (after upcoming): Rs. {Math.max(0, parseFloat(remainingAfterUpcoming||0)).toFixed(1)}</p>
            {upcomingDescription && <p className={styles.sectionText}>{upcomingDescription}</p>}
          </div>
        </div>

        {packagePrice !== 0 && remainingAfterUpcoming == 0 ? (
          <div>
            <h2 style={{color: "#7FFF00"}}>Payment Successfully Complete</h2>
          </div>
        ) : (
          <div>
            <h2 style={{color: selectedColor}}>Upcoming Payments Pending</h2>
          </div>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div>
      <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
        {upcomingTitle}
      </h3>

      <div className={styles.UpComitemsContainer}>
        {!isMobile && (
          <div className={styles.UpComitemsHeader}>
            <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>ITEM</div>
            <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>DESCRIPTION</div>
            <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>AMOUNT</div>
          </div>
        )}
      </div>

      <div className={styles.sectionContent}>
        <p className={styles.sectionTextM}>Full Package: Rs. {parseFloat(packagePrice||0).toFixed(1)}</p>
        <p className={styles.sectionTextM}>Paid Now (Items Total): Rs. {parseFloat(total||0).toFixed(1)}</p>
        <p className={styles.sectionTextM}>Remaining (before upcoming): Rs. {Math.max(0, parseFloat(remainingBeforeUpcoming||0)).toFixed(1)}</p>

        {upcomingError && <p style={{ color: 'red', marginTop: 8 }}>{upcomingError}</p>}

        {availableForUpcoming > 0 ? (
          <>
            {upcomingItems.map(item => (
              <div key={item.id} className={`${styles.formGrid} ${styles.upcomingRow}`}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Description"
                  value={item.desc}
                  onChange={(e) => updateUpcomingItem(item.id, "desc", e.target.value, availableForUpcoming)}
                />
                <input
                  type="number"
                  className={styles.input}
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    updateUpcomingItem(item.id, "price", isNaN(v) ? 0 : v, availableForUpcoming);
                  }}
                />
                <button className={styles.deleteBtn} onClick={() => deleteUpcomingItem(item.id)}>
                  Delete
                </button>
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <button onClick={() => addUpcomingItem(availableForUpcoming)} className={styles.addItemButton} style={{ color: selectedColor }}>
                + Add Upcoming Item
              </button>
            </div>
          </>
        ) : (
          <p style={{ color: '#666', marginTop: 8 }}>No remaining amount available for upcoming items.</p>
        )}

        <div style={{ marginTop: 12 }}>
          <p className={styles.sectionTextM}>Upcoming Items Total: Rs. {parseFloat(upcomingTotal||0).toFixed(1)}</p>
          <p className={styles.sectionTextM}>Remaining (after upcoming): Rs. {Math.max(0, parseFloat(remainingAfterUpcoming||0)).toFixed(1)}</p>
        </div>

        {upcomingDescription && <p className={styles.sectionText}>{upcomingDescription}</p>}
      </div>
    </div>
  );
}