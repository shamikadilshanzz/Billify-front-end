// src/components/UserDash/UserDash.jsx

import React, { useRef } from 'react';
import { Download, Edit2, Eye, Save } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import styles from './userDash.module.css';

// Hooks
import { useInvoiceData } from './hooks/useInvoiceData';
import { useImageUpload } from './hooks/useImageUpload';

// Components
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceSection from './components/InvoiceSection';
import InvoiceMetadata from './components/InvoiceMetadata';
import ItemsList from './components/ItemsList';
import SummarySection from './components/SummarySection';
//import UpcomingItems from './components/UpcomingItems';
import NotesSection from './components/NotesSection';
import SignatureSection from './components/SignatureSection';
import PhotosSection from './components/PhotosSection';
import ColorPicker from './components/ColorPicker';
import PaymentScheduling from './components/PaymentScheduling';

// Utils
import { 
  calculateSubtotal, 
  calculateDiscount, 
  calculateTotal, 
  calculateUpcomingTotal,
  calculateRemainingBeforeUpcoming,
  calculateRemainingAfterUpcoming,
  calculateAvailableForUpcoming
} from './utils/calculations';
import { generatePDFHTML, downloadPDF } from './utils/pdfGenerator';
import { IS_MOBILE } from './utils/constants';

// Services
import { saveInvoice, updateInvoice } from '../../services/invoiceService';

export default function UserDash({ invoiceId, invoiceData: initialInvoiceData, onSaveComplete }) {
  const { user } = useUser();
  const invoiceRef = useRef(null);
  const logoInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const photosInputRef = useRef(null);

  // Custom hooks
  const {
    activeTab, setActiveTab,
    selectedColor, setSelectedColor,
    items, addItem, deleteItem, updateItem,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    packagePrice, setPackagePrice,
    upcomingTitle,
    upcomingDescription,
    upcomingItems, addUpcomingItem, updateUpcomingItem, deleteUpcomingItem,
    upcomingError,
    formData, updateFormData,
    upcomingPayments,
    addUpcomingPayment,
    updateUpcomingPayment,
    deleteUpcomingPayment
  } = useInvoiceData(initialInvoiceData, invoiceId);

  const {
    logoImage,
    signatureImage,
    photos,
    handleLogoUpload,
    handleSignatureUpload,
    handlePhotosUpload,
    removePhoto
  } = useImageUpload(initialInvoiceData, invoiceId);

  // Calculations
  const subtotal = calculateSubtotal(items);
  const discountPrice = calculateDiscount(subtotal, discountType, discountValue);
  const total = calculateTotal(subtotal, discountPrice);
  const balanceDue = total;
  const remainingBeforeUpcoming = calculateRemainingBeforeUpcoming(packagePrice, balanceDue);
  const upcomingTotal = calculateUpcomingTotal(upcomingItems);
  const remainingAfterUpcoming = calculateRemainingAfterUpcoming(packagePrice, balanceDue, upcomingTotal);
  const availableForUpcoming = calculateAvailableForUpcoming(remainingBeforeUpcoming);

  // Handlers
  const handleSave = async () => {
    if (!user) {
      console.error('User not authenticated');
      alert('You must be logged in to save.');
      return;
    }
  
    const data = {
      activeTab,
      selectedColor,
      items,
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
      upcomingPayments
    };
  
    try {
      if (invoiceId) {
        await updateInvoice(invoiceId, data, user.id); // Pass userId
        console.log('Invoice updated successfully!');
      } else {
        const savedInvoice = await saveInvoice(data, user.id);
        console.log('Invoice saved successfully!');
        window.alert("Invoice saved successfully!");
        // Optionally update the invoiceId in state or redirect
      }
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    //await handleSave();
    const html = generatePDFHTML({
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
      upcomingItems,
      packagePrice,
      remainingAfterUpcoming,
      signatureImage,
      photos,
      upcomingPayments
    });
    downloadPDF(html);
  };

  // Render Preview with PDF styling
  const renderPreviewContent = () => {
    /* const status = () => {
      if (packagePrice !== 0 && remainingAfterUpcoming == 0) {
        return <h2 style={{ color: "#7FFF00", marginTop: 20 }}>Payment Successfully Complete</h2>;
      } else {
        return <h2 style={{ color: selectedColor, marginTop: 20 }}>Upcoming Payments Pending</h2>;
      }
    }; */

    return (
      <div style={{
        width: '600px',
        maxWidth: '900px',
        margin: '0 auto',
        background: '#fff',
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Top Border */}
        <div style={{
          height: '120px',
          background: selectedColor,
          borderBottomLeftRadius: '80px',
          marginBottom: '30px'
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '-80px',
          padding: '0 20px'
        }}>
          <div style={{
            fontSize: '38px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '3px',
            marginTop: '-120px',
            marginLeft: '30px',
            fontFamily: "Cal Sans, sans-serif"
          }}>
            {formData.invoiceTitle || 'Invoice'}
          </div>
          {logoImage && (
            <img src={logoImage} alt="Logo" style={{
              maxWidth: '120px',
              borderRadius: '8px',
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.37)',
            }} />
          )}
        </div>

        {/* Info Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '30px'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: selectedColor,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>From</div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>
              {formData.businessName}<br />
              {formData.businessEmail}<br />
              {formData.businessStreet}<br />
              {formData.businessPhone}
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: selectedColor,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>Bill To</div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>
              {formData.clientName}<br />
              {formData.clientEmail}<br />
              {formData.clientStreet}<br />
              {formData.clientPhone}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          marginTop: '20px',
          padding: '15px 0'
        }}>
          <div style={{ fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Number:</span>{' '}
            <span style={{ color: '#555' }}>{formData.invoiceNumber}</span>
          </div>
          <div style={{ fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Date:</span>{' '}
            <span style={{ color: '#555' }}>{formData.invoiceDate}</span>
          </div>
          <div style={{ fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Terms:</span>{' '}
            <span style={{ color: '#555' }}>{formData.terms}</span>
          </div>
        </div>

        <br />
        <div style={{ fontSize: '14px' }}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>Package Price:</span>{' '}
          <span style={{ color: 'black', fontWeight: 'bold' }}>Rs. {parseFloat(packagePrice || 0).toFixed(2)}</span>
        </div>

        {/* Items Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '30px'
        }}>
          <thead style={{ background: selectedColor, color: 'white' }}>
            <tr>
              <th style={{
                padding: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '.5px',
                textAlign: 'left'
              }}>Description</th>
              <th style={{
                padding: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '.5px',
                textAlign: 'left'
              }}>Rate</th>
              <th style={{
                padding: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '.5px',
                textAlign: 'left'
              }}>Qty</th>
              <th style={{
                padding: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '.5px',
                textAlign: 'right'
              }}>Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'black',
                  borderBottom: '1px solid #e2e2e2'
                }}>
                  <div>{item.description}</div>
                  {item.details && <div style={{ color: '#999', fontSize: '12px' }}>{item.details}</div>}
                </td>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '14px',
                  color: 'black',
                  borderBottom: '1px solid #e2e2e2'
                }}>{(parseFloat(item.rate) || 0).toFixed(2)}</td>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '14px',
                  color: 'black',
                  borderBottom: '1px solid #e2e2e2'
                }}>{item.qty}</td>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '14px',color: 'black',
                  borderBottom: '1px solid #e2e2e2',
                  textAlign: 'right'
                }}>{(parseFloat(item.amount) || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '30px'
        }}>
          <div style={{ width: '300px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              fontSize: '14px',
              color: '#555',
              borderTop: '1px solid #ddd',
              paddingTop: '15px'
            }}>
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              fontSize: '14px',
              color: '#555'
            }}>
              <span>Discount {discountType === 'percentage' ? '(' + discountValue + '%)' : ''}:</span>
              <span>Rs. {discountPrice.toFixed(2)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              fontSize: '14px',
              color: '#555',
              fontWeight: 'bold',
              borderTop: '1px solid #ccc',
              paddingTop: '10px'
            }}>
              <span>Total:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: selectedColor,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              padding: '14px',
              borderRadius: '6px',
              marginTop: '15px'
            }}>
              <span>Balance Due:</span>
              <span>Rs. {balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Scheduling Preview */}
        <PaymentScheduling
          activeTab="Preview"
          total={total}
          packagePrice={packagePrice}
          upcomingPayments={upcomingPayments}
          addUpcomingPayment={addUpcomingPayment}
          updateUpcomingPayment={updateUpcomingPayment}
          deleteUpcomingPayment={deleteUpcomingPayment}
          selectedColor={selectedColor}
          isMobile={IS_MOBILE}
        />

        {/* Status */}
        {/* {status()} */}

        {/* Notes Section */}
        {formData.notes && (
          <div style={{
            marginTop: '40px',
            paddingTop: '25px',
            borderTop: '1px solid #ddd'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: selectedColor,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>Notes</div>
            <div style={{
              fontSize: '13px',
              color: '#666',
              lineHeight: '1.7'
            }}>{formData.notes}</div>
          </div>
        )}

        {/* Signature Section */}
        {signatureImage && (
          <div style={{ marginTop: '40px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: selectedColor,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>Signature</div>
            <img src={signatureImage} alt="Signature" style={{
              maxWidth: '230px',
              marginTop: '10px'
            }} />
          </div>
        )}

        {/* Photos Section */}
        {photos.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: selectedColor,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>Photos</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '15px'
            }}>
              {photos.map(photo => (
                <img key={photo.id} src={photo.url} alt="Photo" style={{
                  width: '100%',
                  height: '170px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${IS_MOBILE ? styles.containerMobile : ''}`}>
      {/* Top Navigation Tabs */}
      <div className={`${styles.navTabs} ${IS_MOBILE ? styles.navTabsMobile : ''}`}>
        <button 
          className={`${styles.tabButton} ${IS_MOBILE ? styles.tabButtonMobile : ''} ${activeTab === 'Preview' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('Preview')}
        >
          <Eye color='white' size={IS_MOBILE ? 14 : 18} />
          Preview
        </button>
        <button 
          className={`${styles.tabButton} ${IS_MOBILE ? styles.tabButtonMobile : ''} ${activeTab === 'Edit' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('Edit')}
        >
          <Edit2 color='white' size={IS_MOBILE ? 14 : 18} />
          Edit
        </button>
        <button
          className={`${styles.tabButton} ${IS_MOBILE ? styles.tabButtonMobile : ''}`}
          onClick={handleDownloadPDF}
        >
          <Download color="white" size={IS_MOBILE ? 14 : 18} />
          {IS_MOBILE ? 'PDF' : 'Download PDF'}
        </button>
        <button
          className={`${styles.tabButton} ${IS_MOBILE ? styles.tabButtonMobile : ''}`}
          onClick={handleSave}
        >
          <Save color="white" size={IS_MOBILE ? 14 : 18} />
          {IS_MOBILE ? 'PDF' : 'Save PDF'}
        </button>
      </div>

      <div className={`${styles.mainGrid} ${activeTab === 'Preview' ? styles.mainGridPreview : IS_MOBILE ? styles.mainGridMobile : styles.mainGridDesktop}`}>
        {/* Main Invoice Content */}
        {activeTab === 'Preview' ? (
          // Render PDF-styled preview
          renderPreviewContent()
        ) : (
          // Render Edit mode
          <div 
            ref={invoiceRef} 
            className={styles.invoiceContainer} 
            style={{ borderTop: `5px solid ${selectedColor}`, boxShadow: `0 0 30px ${selectedColor}40` }}
          >
            <InvoiceHeader 
              activeTab={activeTab}
              formData={formData}
              updateFormData={updateFormData}
              logoImage={logoImage} 
              logoInputRef={logoInputRef}
              handleLogoUpload={handleLogoUpload}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
            />

            <InvoiceSection 
              title="From"
              activeTab={activeTab}
              formData={formData}
              updateFormData={updateFormData}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
              fields={[
                { key: 'businessName' },
                { key: 'businessEmail', type: 'email' },
                { key: 'businessStreet' },
                { key: 'businessPhone', type: 'tel', placeholder: '07* *** ****' }
              ]}
            />

            <InvoiceSection 
              title="Bill To"
              activeTab={activeTab}
              formData={formData}
              updateFormData={updateFormData}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
              fields={[
                { key: 'clientName' },
                { key: 'clientEmail', type: 'email' },
                { key: 'clientStreet' },
                { key: 'clientPhone', type: 'tel' }
              ]}
            />

            <InvoiceMetadata 
              activeTab={activeTab}
              formData={formData}
              updateFormData={updateFormData}
              isMobile={IS_MOBILE}
            />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle} style={{ color: selectedColor }}>
                Package Price
              </h3>
              <div className={styles.formGrid}>
                <input
                  type="number"
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

            <ItemsList 
              items={items}
              activeTab={activeTab}
              updateItem={updateItem}
              deleteItem={deleteItem}
              addItem={addItem}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
            />

            <SummarySection 
              subtotal={subtotal}
              discountPrice={discountPrice}
              total={total}
              balanceDue={balanceDue}
              selectedColor={selectedColor}
            />

            {/* Payment Scheduling Component in Edit Mode */}
            <PaymentScheduling
              activeTab={activeTab}
              total={total}
              packagePrice={packagePrice}
              upcomingPayments={upcomingPayments}
              addUpcomingPayment={addUpcomingPayment}
              updateUpcomingPayment={updateUpcomingPayment}
              deleteUpcomingPayment={deleteUpcomingPayment}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
            />

            {/* <UpcomingItems 
              activeTab={activeTab}
              upcomingTitle={upcomingTitle}
              upcomingDescription={upcomingDescription}
              upcomingItems={upcomingItems}
              upcomingError={upcomingError}
              packagePrice={packagePrice}
              total={total}
              remainingBeforeUpcoming={remainingBeforeUpcoming}
              upcomingTotal={upcomingTotal}
              remainingAfterUpcoming={remainingAfterUpcoming}
              availableForUpcoming={availableForUpcoming}
              updateUpcomingItem={updateUpcomingItem}
              deleteUpcomingItem={deleteUpcomingItem}
              addUpcomingItem={addUpcomingItem}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
            /> */}

            <NotesSection 
              activeTab={activeTab}
              formData={formData}
              updateFormData={updateFormData}
              selectedColor={selectedColor}
            />

            <SignatureSection 
              activeTab={activeTab}
              signatureImage={signatureImage}
              signatureInputRef={signatureInputRef}
              handleSignatureUpload={handleSignatureUpload}
              selectedColor={selectedColor}
            />

            <PhotosSection 
              activeTab={activeTab}
              photos={photos}
              removePhoto={removePhoto}
              photosInputRef={photosInputRef}
              handlePhotosUpload={handlePhotosUpload}
              selectedColor={selectedColor}
              isMobile={IS_MOBILE}
            />
          </div>
        )}

        {/* Right Sidebar - Only show in Edit mode and not on mobile */}
        {activeTab === 'Edit' && !IS_MOBILE && (
          <ColorPicker 
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
          />
        )}
      </div>
    </div>
  );
}