import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from '../userDash.module.css';
import { TERMS_OPTIONS } from '../utils/constants';

export default function InvoiceMetadata({ 
  activeTab, 
  formData, 
  updateFormData, 
  isMobile 
}) {
  const parseDateString = (dateString) => {
    if (!dateString) return new Date();
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    updateFormData('invoiceDate', formattedDate);
  };

  return (
    <div className={`${styles.metadataGrid} ${isMobile ? styles.metadataGridMobile : ''}`}>
      <div>
        <label className={styles.metadataLabel}>Number</label>
        {activeTab === 'Edit' ? (
          <input 
            type="text" 
            value={formData.invoiceNumber} 
            onChange={(e) => updateFormData('invoiceNumber', e.target.value)} 
            className={styles.input} 
          />
        ) : (
          <p className={styles.metadataValue}>{formData.invoiceNumber}</p>
        )}
      </div>
      
      <div>
        <label className={styles.metadataLabel}>Date</label>
        {activeTab === 'Edit' ? (
          <DatePicker
            selected={parseDateString(formData.invoiceDate)}
            onChange={handleDateChange}
            dateFormat="MMM dd, yyyy"
            showPopperArrow={false}
            todayButton="Today"
            className={styles.input}
            wrapperClassName={styles.datePickerWrapper}
          />
        ) : (
          <p className={styles.metadataValue}>{formData.invoiceDate}</p>
        )}
      </div>
      
      <div>
        <label className={styles.metadataLabel}>Terms</label>
        {activeTab === 'Edit' ? (
          <select 
            value={formData.terms} 
            onChange={(e) => updateFormData('terms', e.target.value)} 
            className={styles.select}
          >
            {TERMS_OPTIONS.map(term => (
              <option key={term} className={styles.selectOption}>
                {term}
              </option>
            ))}
          </select>
        ) : (
          <p className={styles.metadataValue}>{formData.terms}</p>
        )}
      </div>
    </div>
  );
}