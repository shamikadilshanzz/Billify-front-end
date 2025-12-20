// src/components/UserDash/utils/pdfGenerator.js

export const generatePDFHTML = ({
  selectedColor,
  formData,
  logoImage,
  items,
  subtotal,
  discountType,
  discountValue,
  discountPrice,
  total,
  balanceDue,
  upcomingPayments = [],
  packagePrice,
  signatureImage,
  photos
}) => {
  // Calculate payment schedule remaining
  const scheduledPaymentsTotal = (upcomingPayments || []).reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const paymentScheduleRemaining = parseFloat(packagePrice || 0) - parseFloat(total || 0) - parseFloat(scheduledPaymentsTotal || 0);
  
  // Status function matching InvoicePreviewPage
  const status = () => {
    if (paymentScheduleRemaining === 0) return "";
  
    return `
      <div class="payment-schedule-remaining">
        <span>Balance Remaining</span>
        <span>Rs. ${paymentScheduleRemaining.toFixed(2)}</span>
      </div>
    `;
  };

  return `
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
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.37);
      }

      .section-title {
        font-size: 14px;
        font-weight: 700;
        color: ${selectedColor};
        text-transform: uppercase;
        margin-bottom: 6px;
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

      .package-value {
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
        text-align: left;
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
        color: black;
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
        color: black;
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

      /* PAYMENT SCHEDULE */
      .payment-schedule-wrapper {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }

      .payment-schedule {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 41%;
        max-width: 520px;
        margin-left: auto;
      }

      .payment-schedule-header {
        color: ${selectedColor};
        font-size: 14px;
        margin: 0;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: .2px;
      }

      .payment-schedule-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: white;
        border-radius: 8px;
        margin-bottom: 10px;
        border: 1px solid #e0e0e0;
      }

      .payment-schedule-item:last-child {
        font-weight: 600;
        font-size: 15px;
        color: #333;
        margin-bottom: 4px;
      }

      .payment-schedule-remaining {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-top: 0px;
        font-weight: bold;
        font-size: 15px;
        background: ${selectedColor};
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
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="top-border"></div>
        
        <div class="invoice-header">
          <div>
            <div class="invoice-title">${formData?.invoiceTitle || 'Invoice'}</div>
          </div>
          ${logoImage ? `<img src="${logoImage}" class="logo" alt="Logo" />` : ''}
        </div>
        
        <div class="info-section">
          <div>
            <div class="section-title">From</div>
            <div class="section-content">
              ${formData?.businessName || ''}<br>
              ${formData?.businessEmail || ''}<br>
              ${formData?.businessStreet || ''}<br>
              ${formData?.businessPhone || ''}
            </div>
          </div>
          
          <div>
            <div class="section-title">Bill To</div>
            <div class="section-content">
              ${formData?.clientName || ''}<br>
              ${formData?.clientEmail || ''}<br>
              ${formData?.clientStreet || ''}<br>
              ${formData?.clientPhone || ''}
            </div>
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="detail-item">
            <span class="detail-label">Number:</span> 
            <span class="detail-value">${formData?.invoiceNumber || ''}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Date:</span> 
            <span class="detail-value">${formData?.invoiceDate || ''}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Terms:</span> 
            <span class="detail-value">${formData?.terms || ''}</span>
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
            ${(items || []).map(item => `
              <tr>
                <td>
                  <div class="item-description">${item.description || ''}</div>
                  ${item.details ? `<div class="item-details">${item.details}</div>` : ''}
                </td>
                <td>${(parseFloat(item.rate)||0).toFixed(2)}</td>
                <td>${item.qty || 0}</td>
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

        ${(upcomingPayments || []).length > 0 ? `
          <div class="payment-schedule-wrapper">
            <div class="payment-schedule">
              <h4 class="payment-schedule-header">Upcoming Payments</h4>
              ${(upcomingPayments || []).map(p => `
                <div class="payment-schedule-item">
                  <div>
                    <div>${p.description || 'Payment'}</div>
                    <div style="color:#666;font-size:12px;">Due ${p.dueDate || ''}</div>
                  </div>
                  <div>Rs. ${(parseFloat(p.amount)||0).toFixed(2)}</div>
                </div>
              `).join('')}
              ${status()}
            </div>
          </div>
        ` : ''}
        
        ${formData?.notes ? `
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
        
        ${photos && photos.length > 0 ? `
          <div class="photos-section">
            <div class="section-title">Photos</div>
            <div class="photos-grid">
              ${photos.map(photo => `<img src="${photo.url || photo}" class="photo" alt="Photo" />`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};

export const downloadPDF = (html) => {
  const printWindow = window.open('');
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};