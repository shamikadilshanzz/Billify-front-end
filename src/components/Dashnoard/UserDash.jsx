import React, { useState, useRef, useEffect } from 'react';
import { Download, Edit2, Eye, Upload, Camera, Grape } from 'lucide-react';
import styles from './userDash.module.css';
import { useUser } from '@clerk/clerk-react';
import { saveInvoice, updateInvoice } from '../../services/invoiceService';

export default function UserDash({ invoiceId, invoiceData: initialInvoiceData, onSaveComplete }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Preview');
  const [selectedColor, setSelectedColor] = useState('#A700ED');
  const [items, setItems] = useState([
    { id: 1, description: 'Item Description', details: '', rate: 0.00, qty: 1, amount: 0.00 }
  ]);

  const [financingEnabled, setFinancingEnabled] = useState(true);
  const [logoImage, setLogoImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const invoiceRef = useRef(null);
  const logoInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const photosInputRef = useRef(null);
  const isMobile = window.innerWidth <= 430;
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [packagePrice, setPackagePrice] = useState(0);
  const [upcomingTitle, setUpcomingTitle] = useState("Upcoming Payment");
  const [upcomingDescription, setUpcomingDescription] = useState("");

  const [upcomingItems, setUpcomingItems] = useState([
    { id: 1, desc: "", price: 0.00 }
  ]);
  const [upcomingError, setUpcomingError] = useState("");

  const [formData, setFormData] = useState({
    invoiceTitle: 'Invoice',
    businessName: 'Business Name',
    businessEmail: 'name@business.com',
    businessStreet: 'Street',
    businessPhone: '07* *** ****',
    businessTax: '07* *** ****',
    clientName: 'Client Name',
    clientEmail: 'name@client.com',
    clientStreet: 'Street',
    clientPhone: '07* *** ****',
    invoiceNumber: `IV${Math.floor(Math.random()*1000000)}`,
    invoiceDate: 'Nov 27, 2025',
    terms: 'On Receipt',
    notes: '',
    packagePrice: '0'
  });

  // Load invoice data if editing
  useEffect(() => {
    if (initialInvoiceData && invoiceId) {
      setSelectedColor(initialInvoiceData.selectedColor || '#A700ED');
      setItems(initialInvoiceData.items || [{ id: 1, description: 'Item Description', details: '', rate: 0.00, qty: 1, amount: 0.00 }]);
      setFinancingEnabled(initialInvoiceData.financingEnabled !== undefined ? initialInvoiceData.financingEnabled : true);
      setLogoImage(initialInvoiceData.logoImage || null);
      setSignatureImage(initialInvoiceData.signatureImage || null);
      setPhotos(initialInvoiceData.photos || []);
      setDiscountType(initialInvoiceData.discountType || 'percentage');
      setDiscountValue(initialInvoiceData.discountValue || 0);
      setPackagePrice(initialInvoiceData.packagePrice || 0);
      setUpcomingTitle(initialInvoiceData.upcomingTitle || "Upcoming Payment");
      setUpcomingDescription(initialInvoiceData.upcomingDescription || "");
      setUpcomingItems(initialInvoiceData.upcomingItems || [{ id: 1, desc: "", price: 0.00 }]);
      setPackagePrice(initialInvoiceData.packagePrice || 0);
      if (initialInvoiceData.formData) {
        setFormData(initialInvoiceData.formData);
      }
    }
  }, [initialInvoiceData, invoiceId]);

  const colors = [
    '#9CFF00', '#FFAA00', '#FF7F00', '#FF0000',
    '#FF0068', '#F800FF', '#C000FF', '#008CFF',
    '#3F0000', '#5E005A', '#001F63', '#4F4700',
    '#BCBCBC', '#A0A0A0', '#515151', '#111111'
  ];

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      description: 'Item Description', 
      details: '', 
      rate: 0.0,
      qty: 1, 
      amount: 0.0
    }]);
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'rate' || field === 'qty') {
          const rate = parseFloat(updated.rate) || 0;
          const qty = parseFloat(updated.qty) || 0;
          updated.amount = rate * qty;
        }
        return updated;
      }
      return item;
    }));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignatureImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, { id: Date.now() + Math.random(), url: event.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };


  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  let discountPrice = 0;

  if (discountType === 'percentage') {
    discountPrice = (subtotal * (parseFloat(discountValue) || 0)) / 100;
  } else {
    discountPrice = parseFloat(discountValue) || 0;
  }
  
  let total = subtotal - discountPrice;
  if (isNaN(total)) total = 0;
  const balanceDue = total;


  const remainingBeforeUpcoming = parseFloat(packagePrice || 0) - parseFloat(balanceDue || 0);


  const upcomingTotal = upcomingItems.reduce((s, it) => s + (parseFloat(it.price) || 0), 0);


  const remainingAfterUpcoming = parseFloat(packagePrice || 0) - parseFloat(balanceDue || 0) - parseFloat(upcomingTotal || 0);

  const availableForUpcoming = Math.max(0, remainingBeforeUpcoming);
  const addUpcomingItem = () => {
    setUpcomingError("");
    if (availableForUpcoming <= 0) {
      setUpcomingError("No remaining amount available to add upcoming items.");
      return;
    }

    setUpcomingItems(prev => [...prev, { id: Date.now(), desc: "", price: 0.00 }]);
  };

  const updateUpcomingItem = (id, field, value) => {
    setUpcomingError("");
    setUpcomingItems(prev => {

      const next = prev.map(it => it.id === id ? { ...it, [field]: value } : it);

      const nextTotal = next.reduce((s, it) => s + (parseFloat(it.price) || 0), 0);

      if (nextTotal - 1e-9 > availableForUpcoming) { 
        setUpcomingError(`Total of upcoming items cannot exceed remaining Rs. ${availableForUpcoming.toFixed(2)}.`);
        return prev; 
      }

      return next;
    });
  };

  const deleteUpcomingItem = (id) => {
    setUpcomingError("");
    setUpcomingItems(prev => prev.filter(i => i.id !== id));
  };
  const status = () => {
    if (packagePrice !== 0 && remainingAfterUpcoming == 0) {
      return `<h2 style="color:#7FFF00">Payment Successfully Complete</h2>`;
    } else {
      return `<h2 style="color:${selectedColor}">Upcoming Payments Pending</h2>`;
    }
  };   
  
  const handleSave = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const data = {
      activeTab,
      selectedColor,
      items,
      financingEnabled,
      logoImage,
      signatureImage,
      photos,
      upcomingItems,
      upcomingTitle,
      upcomingDescription,
      upcomingError,
      discountType,
      discountValue,
      packagePrice,
      formData,
    };

    try {
      if (invoiceId) {
        // Update existing invoice
        await updateInvoice(invoiceId, data);
        console.log('Invoice updated successfully!');
      } else {
        // Create new invoice
        await saveInvoice(data, user.id);
        console.log('Invoice saved successfully!');
      }
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  const handleDownloadAndSave = async () => {
    await handleSave();   // save to Firestore
    downloadPDF();         // generate PDF
  };

  const downloadPDF = async () => {
    const printWindow = window.open('');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formData.invoiceNumber}</title>
        <style>
          /* RESET */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Arial", sans-serif;
          padding: 40px;
          background: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color: #333;
        }

     
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .top-border {
          height: 120px;
          background:${selectedColor};
          border-bottom-left-radius: 80px;
          margin-bottom: 30px;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -80px;
          padding: 0 20px;
        }

        .invoice-title {
          display: flex;
          justify-content: center; 
          align-items: center;
          font-size: 38px;
          font-weight: bold;
          color: white;
          letter-spacing: 3px;
          margin-top: -80px;
          margin-left: 50px;
          font-family: "Cal Sans", sans-serif;
        }


        .logo {
          max-width: 120px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px black
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: ${selectedColor};
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .section-titleM {
          font-size: 14px;
          font-weight: 700;
          color:${selectedColor};
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .section-content {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
        }

        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 30px;
        }

        .invoice-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-top: 20px;
          padding: 15px 0;
        }

        .detail-item {
          font-size: 14px;
        }

        .detail-label {
          font-weight: bold;
          color: #333;
        }

        .detail-value {
          color: #555;
        }
        .package-value{
          color: black;
          font-weight: bold;          
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }

        .items-table thead {
          background: ${selectedColor};
          color: white;
        }

        .items-table th {
          padding: 12px;
          font-size: 13px;
          font-weight: bold;
          font-family: "Cal Sans", sans-serif;
          text-transform: uppercase;
          letter-spacing: .5px;
          text-align: left; /* <-- works */
        }

        .items-table td {
          padding: 14px 12px;
          font-size: 14px;
          border-bottom: 1px solid #e2e2e2;
        }

        .items-table th:last-child,
        .items-table td:last-child {
          text-align: right;
        }
          .items-tableM {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
          color: white;
        }

        .items-tableM thead {
          background: ${selectedColor};
          color: white;
        }

        .items-tableM th {
          padding: 12px;
          font-size: 13px;
          font-weight: bold;
          font-family: "Cal Sans", sans-serif;
          text-transform: uppercase;
          letter-spacing: .5px;
          text-align: left; /* <-- works */
        }


        .items-tableM td {
          padding: 14px 12px;
          font-size: 14px;
          border-bottom: 1px solid #e2e2e2;
        }

        .items-tableM th:last-child,
        .items-tableM td:last-child {
          text-align: right;
        }

        /* SUMMARY SECTION */
        .summary-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .summary {
          width: 300px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: #555;
        }

        .summary-row.subtotal {
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }

        .summary-row.total {
          font-weight: bold;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }

        .summary-row.balance-due {
          background: ${selectedColor} !important;
          color: white !important;
          font-weight: bold;
          font-size: 18px;
          padding: 14px;
          border-radius: 6px;
          margin-top: 15px;
        }

        .notes-section {
          margin-top: 40px;
          padding-top: 25px;
          border-top: 1px solid #ddd;
        }

        .notes-content {
          font-size: 13px;
          color: #666;
          line-height: 1.7;
        }

        .signature-section {
          margin-top: 40px;
        }

        .signature-image {
          max-width: 230px;
          margin-top: 10px;
        }

        /* PHOTOS */
        .photos-section {
          margin-top: 40px;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 15px;
        }

        .photo {
          width: 100%;
          height: 170px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
        @page {
          margin: 0;
        }

        @media print {
          body {
            margin: 0 !important;
            padding: 20px 40px !important;
          }
          .invoice-container {
            max-width: 100%;
          }
        }

          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="top-border"></div>
          
          <div class="invoice-header">
            <div>
              <div class="invoice-title">${formData.invoiceTitle || 'Invoice'}</div>
            </div>
            ${logoImage ? `<img src="${logoImage}" class="logo" alt="Logo" />` : ''}
          </div>
          
          <div class="info-section">
            <div>
              <div class="section-title">From</div>
              <div class="section-content">
                ${formData.businessName}<br>
                ${formData.businessEmail}<br>
                ${formData.businessStreet}<br>
                ${formData.businessPhone}
              </div>
            </div>
            
            <div>
              <div class="section-title">Bill To</div>
              <div class="section-content">
                ${formData.clientName}<br>
                ${formData.clientEmail}<br>
                ${formData.clientStreet}<br>
                ${formData.clientPhone}
              </div>
            </div>
          </div>
          
          <div class="invoice-details">
          <div class="detail-item">
            <span class="detail-label">Number:</span> 
            <span class="detail-value">${formData.invoiceNumber}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Date:</span> 
            <span class="detail-value">${formData.invoiceDate}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Terms:</span> 
            <span class="detail-value">${formData.terms}</span>
          </div>
        </div>
        <br/>
        <div class="detail-item">
            <span class="detail-label">Package Price:</span>
            <span class="package-value">Rs. ${parseFloat(packagePrice || 0).toFixed(2)}</span>
          </div>    
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Amount (LKR)</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>
                    <div class="item-description">${item.description}</div>
                    ${item.details ? `<div class="item-details">${item.details}</div>` : ''}
                  </td>
                  <td>${(parseFloat(item.rate)||0).toFixed(2)}</td>
                  <td>${item.qty}</td>
                  <td>${(parseFloat(item.amount)||0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary-section">
            <div class="summary">
              <div class="summary-row subtotal">
                <span>Subtotal:</span>
                <span>Rs. ${subtotal.toFixed(2)}</span>
              </div>
              
              <div class="summary-row">
                <span>Discount ${discountType === 'percentage' ? '(' + discountValue + '%)' : ''}:</span>
                <span>Rs. ${discountPrice.toFixed(2)}</span>
              </div>
              
              <div class="summary-row total">
                <span>Total:</span>
                <span>Rs. ${total.toFixed(2)}</span>
              </div>
              
              <div class="summary-row balance-due">
                <span>Balance Due:</span>
                <span>Rs. ${balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <table class="items-tableM">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${upcomingItems.map(item => `
                <tr>
                  <td>
                    <div class="item-descriptionM">${item.desc || ''}</div>
                  </td>
                  <td>${(parseFloat(item.price) || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

                    ${status()}
          ${formData.notes ? `
            <div class="notes-section">
              <div class="section-title">Notes</div>
              <div class="notes-content">${formData.notes}</div>
            </div>
          ` : ''}

          ${signatureImage ? `
            <div class="signature-section">
              <div class="section-title">Signature</div>
              <img src="${signatureImage}" class="signature-image" alt="Signature" />
            </div>
          ` : ''}
          
          ${photos.length > 0 ? `
            <div class="photos-section">
              <div class="section-title">Photos</div>
              <div class="photos-grid">
                ${photos.map(photo => `<img src="${photo.url}" class="photo" alt="Photo" />`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className={`${styles.container} ${isMobile ? styles.containerMobile : ''}`}>
      {/* Top Navigation Tabs */}
      <div className={`${styles.navTabs} ${isMobile ? styles.navTabsMobile : ''}`}>
        <button 
          className={`${styles.tabButton} ${isMobile ? styles.tabButtonMobile : ''} ${activeTab === 'Preview' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('Preview')}
        >
          <Eye color='white' size={isMobile ? 14 : 18} />
          Preview
        </button>
        <button 
          className={`${styles.tabButton} ${isMobile ? styles.tabButtonMobile : ''} ${activeTab === 'Edit' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('Edit')}
        >
          <Edit2 color='white' size={isMobile ? 14 : 18} />
          Edit
        </button>
        <button
  className={`${styles.tabButton} ${isMobile ? styles.tabButtonMobile : ''}`}
  onClick={handleDownloadAndSave}
>
  <Download color="white" size={isMobile ? 14 : 18} />
  {isMobile ? 'PDF' : 'Download PDF'}
</button>

      </div>
      

      <div className={`${styles.mainGrid} ${activeTab === 'Preview' ? styles.mainGridPreview : isMobile ? styles.mainGridMobile : styles.mainGridDesktop}`}>
        {/* Main Content */}
        
        <div ref={invoiceRef} className={styles.invoiceContainer} style={{ borderTop: `5px solid ${selectedColor}`, boxShadow: `0 0 30px ${selectedColor}40` }}>
          {/* Header Section */}
          <div className={`${styles.header} ${isMobile ? styles.headerMobile : ''}`}>
            {activeTab === 'Edit' ? (
              <input 
                type="text" 
                value={formData.invoiceTitle}
                onChange={(e) => updateFormData('invoiceTitle', e.target.value)}
                className={`${styles.invoiceTitleInput} ${isMobile ? styles.invoiceTitleInputMobile : ''}`}
              />
            ) : (
              <h1 className={`${styles.invoiceTitle} ${isMobile ? styles.invoiceTitleMobile : ''}`}>{formData.invoiceTitle}</h1>
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
                  <span className={`${styles.logoText} ${isMobile ? styles.logoTextMobile : ''}`}>Logo</span>
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

          {/* From Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>From</h3>
            {activeTab === 'Edit' ? (
              <div className={`${styles.formGrid} ${isMobile ? styles.formGridMobile : ''}`}>
                <input type="text" value={formData.businessName} onChange={(e) => updateFormData('businessName', e.target.value)} className={styles.input} />
                <input type="email" value={formData.businessEmail} onChange={(e) => updateFormData('businessEmail', e.target.value)} className={styles.input} />
                <input type="text" value={formData.businessStreet} onChange={(e) => updateFormData('businessStreet', e.target.value)} className={styles.input} />
                <input type="tel" placeholder="07* *** ****" value={formData.businessPhone} onChange={(e) => updateFormData('businessPhone', e.target.value)} className={styles.input} />
              </div>
            ) : (
              <div className={styles.sectionContent}>
                <p className={styles.sectionText}>{formData.businessName}</p>
                <p className={styles.sectionText}>{formData.businessEmail}</p>
                <p className={styles.sectionText}>{formData.businessStreet}</p>
                <p  className={styles.sectionText}>{formData.businessPhone}</p>
              </div>
            )}
          </div>

          {/* Bill To Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>Bill To</h3>
            {activeTab === 'Edit' ? (
              <div className={`${styles.formGrid} ${isMobile ? styles.formGridMobile : ''}`}>
                <input type="text" value={formData.clientName} onChange={(e) => updateFormData('clientName', e.target.value)} className={styles.input} />
                <input type="email" value={formData.clientEmail} onChange={(e) => updateFormData('clientEmail', e.target.value)} className={styles.input} />
                <input type="text" value={formData.clientStreet} onChange={(e) => updateFormData('clientStreet', e.target.value)} className={styles.input} />
                <input type="tel" value={formData.clientPhone} onChange={(e) => updateFormData('clientPhone', e.target.value)} className={styles.input} />
              </div>
            ) : (
              <div className={styles.sectionContent}>
                <p className={styles.sectionText}>{formData.clientName}</p>
                <p className={styles.sectionText}>{formData.clientEmail}</p>
                <p className={styles.sectionText}>{formData.clientStreet}</p>
                <p className={styles.sectionText}>{formData.clientPhone}</p>
              </div>
            )}
          </div>

          {/* Invoice Metadata */}
          <div className={`${styles.metadataGrid} ${isMobile ? styles.metadataGridMobile : ''}`}>
            <div>
              <label className={styles.metadataLabel}>Number</label>
              {activeTab === 'Edit' ? (
                <input type="text" value={formData.invoiceNumber} onChange={(e) => updateFormData('invoiceNumber', e.target.value)} className={styles.input} />
              ) : (
                <p className={styles.metadataValue}>{formData.invoiceNumber}</p>
              )}
            </div>
            <div>
              <label className={styles.metadataLabel}>Date</label>
              {activeTab === 'Edit' ? (
                <input type="text" value={formData.invoiceDate} onChange={(e) => updateFormData('invoiceDate', e.target.value)} className={styles.input} />
              ) : (
                <p className={styles.metadataValue}>{formData.invoiceDate}</p>
              )}
            </div>
            <div>
              <label className={styles.metadataLabel}>Terms</label>
              {activeTab === 'Edit' ? (
                <select value={formData.terms} onChange={(e) => updateFormData('terms', e.target.value)} className={styles.select}>
                  <option>On Receipt</option>
                  <option className={styles.selectOption}>Net 15</option>
                  <option className={styles.selectOption}>Net 30</option>
                  <option className={styles.selectOption}>Net 60</option>
                </select>
              ) : (
                <p className={styles.metadataValue}>{formData.terms}</p>
              )}
            </div>
          </div>
          {activeTab === "Edit" && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
                Package Price
              </h3>

              <div className={styles.formGrid}>
                <input
                  type="any"
                  placeholder="Full Package Price"
                  className={styles.input}
                  value={packagePrice}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setPackagePrice(isNaN(v) ? 0 : v);
                  }}
                />
              </div>
            </div>
          )}

          {/* Itemized List */}
          <div className={styles.itemsContainer}>
            {!isMobile && (
              <div className={styles.itemsHeader}>
                <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>DESCRIPTION</div>
                <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>RATE</div>
                <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>QTY</div>
                <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>AMOUNT</div>
              </div>
            )}
            {items.map((item) => (
              <div key={item.id} className={`${styles.itemRow} ${isMobile ? styles.itemRowMobile : ''}`}>
                <div>
                  {isMobile && <div className={styles.itemsHeaderLabel} style={{ color: selectedColor }}>DESCRIPTION</div>}
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
                  {isMobile && <div className={styles.itemFieldLabel} style={{ color: selectedColor }}>RATE:</div>}
                  {activeTab === 'Edit' ? (
                    <input 
                      type="any" 
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className={styles.itemFieldInput}
                    />
                  ) : (
                    <span>Rs. {item.rate.toFixed(1)}</span>
                  )}
                </div>
                <div className={styles.itemField}>
                  {isMobile && <div className={styles.itemFieldLabel} style={{ color: selectedColor }}>QTY:</div>}
                  {activeTab === 'Edit' ? (
                    <input 
                      type="any" 
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                      className={styles.itemFieldInput}
                    />
                    
                  ) : (
                    <span>{item.qty}</span>
                  )}
                </div>
                <div className={`${styles.itemAmount} ${isMobile ? styles.itemAmountMobile : ''}`} style={{ color: selectedColor }}>
                  {isMobile && <div className={`${styles.itemFieldLabel} ${styles.itemFieldLabelAmount}`} style={{ color: selectedColor }}>AMOUNT:</div>}
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
              <button onClick={addItem} className={styles.addItemButton} style={{ color: selectedColor }}>+</button>
            )}
          </div>

          {/* Summary Section */}
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

          {activeTab === "Preview" && (
            <div>
            {availableForUpcoming > 0 && upcomingItems.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ 
                  color: selectedColor, 
                  marginBottom: 10,
                  fontWeight: "600"
                }}>
                  Upcoming Items
                </h3>

                {upcomingItems.map(item => (
                  <div 
                    key={item.id}
                    className={`${styles.itemRow} ${isMobile ? styles.itemRowMobile : ''}`}
                    style={{ marginBottom: "10px" }}
                  >

                    {/* Description */}
                    <div>
                      {isMobile && (
                        <div 
                          className={styles.itemsHeaderLabel}
                          style={{ color: selectedColor }}
                        >
                          DESCRIPTION
                        </div>
                      )}

                      <p className={styles.itemDescription}>
                        {item.desc}
                      </p>

                      {item.details && (
                        <p className={styles.itemDetails}>{item.details}</p>
                      )}
                    </div>
                    {/* Amount (same as price) */}
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

            </div>
          )}
          {activeTab === "Preview" && (
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

                {upcomingDescription && (
                  <p className={styles.sectionText}>{upcomingDescription}</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "Edit" && (
            <div >
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

                {/* Show error if any */}
                {upcomingError && <p style={{ color: 'red', marginTop: 8 }}>{upcomingError}</p>}

                {/* Editable upcoming items — only allow editing if there is available remaining */}
                {availableForUpcoming > 0 ? (
                  <>
                    {upcomingItems.map(item => (
                      <div key={item.id} className={`${styles.formGrid} ${styles.upcomingRow}`}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Description"
                          value={item.desc}
                          onChange={(e) => updateUpcomingItem(item.id, "desc", e.target.value)}
                        />

                        <input
                          type="any"
                          className={styles.input}
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            updateUpcomingItem(item.id, "price", isNaN(v) ? 0 : v);
                          }}
                        />

                        <button
                          className={styles.deleteBtn}
                          onClick={() => deleteUpcomingItem(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <div style={{ marginTop: 10 }}>
                      <button onClick={addUpcomingItem} className={styles.addItemButton} style={{ color: selectedColor }}>+ Add Upcoming Item</button>
                    </div>
                  </>
                ) : (
                  <p style={{ color: '#666', marginTop: 8 }}>No remaining amount available for upcoming items.</p>
                )}

                <div style={{ marginTop: 12 }}>
                  <p className={styles.sectionTextM}>Upcoming Items Total: Rs. {parseFloat(upcomingTotal||0).toFixed(1)}</p>
                  <p className={styles.sectionTextM}>Remaining (after upcoming): Rs. {Math.max(0, parseFloat(remainingAfterUpcoming||0)).toFixed(1)}</p>
                </div>

                {upcomingDescription && (
                  <p className={styles.sectionText}>{upcomingDescription}</p>
                )}
              </div>
            </div>
          )}
            
          {activeTab === "Preview" && (
            packagePrice !==0 && remainingAfterUpcoming ==0 ? (
              <div>
                <h2 style={{color: "#7FFF00"}}>Payment Successfully Complete</h2>
              </div>
              
            ) : 
            <div>
              <h2 style={{color: selectedColor}}>Upcoming Payments Pending</h2>
            </div>
          )}

          {/* Notes Section */}
          {activeTab === 'Edit' ? (
            <div className={styles.section}>
              <textarea 
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                className={styles.textarea}
                placeholder="Notes - any relevant information not covered, additional terms and conditions"
              />
            </div>
          ) : formData.notes ? (
            <div className={styles.notesContainer}>
              <h4 className={styles.notesTitle} style={{ color: selectedColor }}>Notes</h4>
              <p className={styles.notesText}>{formData.notes}</p>
            </div>
          ) : null}

          {/* Signature Section */}
          <div className={styles.section}>
            <h4 className={styles.signatureTitle} style={{ color: selectedColor }}>Signature</h4>
            <div 
              onClick={() => activeTab === 'Edit' && signatureInputRef.current.click()}
              className={`${styles.signatureUpload} ${activeTab === 'Edit' ? styles.signatureUploadEdit : styles.signatureUploadPreview}`}
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

          {/* Photos Section */}
          <div className={styles.section}>
            <h4 className={styles.signatureTitle} style={{ color: selectedColor }}>Photos</h4>
            {photos.length > 0 && (
              <div className={`${styles.photosGrid} ${isMobile ? styles.photosGridMobile : ''}`}>
                {photos.map((photo) => (
                  <div key={photo.id} className={styles.photoItem}>
                    <img src={photo.url} alt="Photo" className={styles.photoImage} />
                    {activeTab === 'Edit' && (
                      <button onClick={() => removePhoto(photo.id)} className={styles.photoRemoveButton}>×</button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Edit' && (
              <div onClick={() => photosInputRef.current.click()} className={styles.photosUpload} style={{ color: selectedColor }}>
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
        </div>

        {/* Right Sidebar - Only show in Edit mode and not on mobile */}
        {activeTab === 'Edit' && !isMobile && (
          <div className={styles.sidebar}>
            {/* Template Color Picker */}
            <div className={styles.sidebarPanel}>
              <h4 className={styles.sidebarTitle}>DOCUMENT COLOR</h4>
              <p className={styles.sidebarText}>Click a color to change the top border</p>
              <div className={styles.colorGrid}>
                {colors.map((color) => (
                  <div 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`${styles.colorSwatch} ${selectedColor === color ? styles.colorSwatchActive : ''}`}
                    style={{ 
                      backgroundColor: color,
                      boxShadow: selectedColor === color ? `0 0 15px ${color}` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Discount */}
            {activeTab === "Edit" && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
                Discount
              </h3>

              <div className={styles.formGrid}>
                {/* Select Discount Type */}
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className={styles.select}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="price">Fixed Price (Rs)</option>
                </select>

                {/* Discount Value */}
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
          )}
          </div>
        )}
      </div>
    </div>
  );
}


