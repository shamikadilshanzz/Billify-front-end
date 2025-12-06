import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/HomePage/Footer';
import { getUserInvoices, deleteInvoice } from '../services/invoiceService';
import { Eye, Edit2, Trash2, FileText, Calendar } from 'lucide-react';
import styles from './history.module.css';

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadInvoices();
    }
  }, [isLoaded, user]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const userInvoices = await getUserInvoices(user.id);
      setInvoices(userInvoices);
      setError(null);
    } catch (err) {
      console.error('Error loading invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (invoiceId) => {
    navigate(`/invoice/${invoiceId}/preview`);
  };

  const handleEdit = (invoiceId) => {
    navigate(`/dashboard?edit=${invoiceId}`);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(invoiceId);
        setInvoices(invoices.filter(inv => inv.id !== invoiceId));
      } catch (err) {
        console.error('Error deleting invoice:', err);
        alert('Failed to delete invoice. Please try again.');
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      let dateObj;
      if (date.toDate && typeof date.toDate === 'function') {

        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else if (date.seconds) {
 
        dateObj = new Date(date.seconds * 1000);
      } else {
        return 'N/A';
      }
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (!isLoaded) {
    return (
      <>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <FileText size={32} color='white' />
            Invoice History
          </h1>
          <button 
            className={styles.newInvoiceBtn}
            onClick={() => navigate('/dashboard')}
          >
            + Create New Invoice
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className={styles.empty}>
            <FileText size={64} />
            <h2>No invoices yet</h2>
            <p>Create your first invoice to get started!</p>
            <button 
              className={styles.newInvoiceBtn}
              onClick={() => navigate('/dashboard')}
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <div className={styles.invoiceGrid}>
            {invoices.map((invoice) => (
              <div key={invoice.id} className={styles.invoiceCard}>
                <div className={styles.invoiceHeader}>
                  <div className={styles.invoiceNumber}>
                    {invoice.formData?.invoiceNumber || 'N/A'}
                  </div>
                  <div 
                    className={styles.colorIndicator}
                    style={{ backgroundColor: invoice.selectedColor || '#A700ED' }}
                  />
                </div>
                
                <div className={styles.invoiceInfo}>
                  <div className={styles.infoRow}>
                    <Calendar size={16} />
                    <span>{formatDate(invoice.createdAt)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Client:</span>
                    <span className={styles.value}>
                      {invoice.formData?.clientName || 'N/A'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Total:</span>
                    <span className={styles.total}>
                      Rs. {(() => {
                        const subtotal = (invoice.items || []).reduce(
                          (sum, item) => sum + (parseFloat(item.amount) || 0), 
                          0
                        );
                        let discountPrice = 0;
                        if (invoice.discountType === 'percentage') {
                          discountPrice = (subtotal * (parseFloat(invoice.discountValue) || 0)) / 100;
                        } else {
                          discountPrice = parseFloat(invoice.discountValue) || 0;
                        }
                        const total = subtotal - discountPrice;
                        return isNaN(total) ? '0.00' : total.toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>

                <div className={styles.invoiceActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleView(invoice.id)}
                    title="Preview"
                  >
                    <Eye size={18} />
                    Preview
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleEdit(invoice.id)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(invoice.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer className={styles.footer}/>
    </>
  );
}

