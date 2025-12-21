import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { firestore } from '../infrastructure/db/firebaseConfig';
import { uploadToR2, compressBase64Image, deleteFromR2 } from './r2Service';


const uploadSingleImage = async (base64Image, path, oldUrl = null) => {
  if (!base64Image) {
    console.log('No image provided for path:', path);
    return null;
  }
  
  // Check if it's already a URL (unchanged image)
  if (!base64Image.startsWith('data:')) {
    console.log('Image is already a URL (unchanged):', base64Image.substring(0, 50) + '...');
    return base64Image;
  }
  
  try {
    // If there's an old URL and we're uploading a new image, delete the old one first
    if (oldUrl && oldUrl.startsWith('http')) {
      try {
        // Extract the path from the URL
        const urlObj = new URL(oldUrl);
        const oldPath = urlObj.pathname.substring(1); // Remove leading '/'
        console.log('Deleting old image:', oldPath);
        await deleteFromR2(oldPath);
      } catch (deleteError) {
        console.warn('Could not delete old image:', deleteError);
        // Continue with upload even if delete fails
      }
    }
    
    // Compress image before upload
    console.log('Compressing image...');
    const compressedImage = await compressBase64Image(base64Image, 1200, 0.85);
    
    // Upload to R2
    const url = await uploadToR2(compressedImage, path);
    return url;
  } catch (error) {
    console.error(`Error uploading image to ${path}:`, error);
    throw error;
  }
};

// Helper function to upload images
const uploadInvoiceImages = async (invoiceData, invoiceId, userId, existingInvoice = null) => {
  console.log('Starting image upload process...');
  const uploadedData = { ...invoiceData };
  
  try {
    // Upload logo
    if (invoiceData.logoImage) {
      console.log('Processing logo image...');
      uploadedData.logoImage = await uploadSingleImage(
        invoiceData.logoImage,
        `invoices/${userId}/${invoiceId}/logo.jpg`,
        existingInvoice?.logoImage
      );
    }
    
    // Upload signature
    if (invoiceData.signatureImage) {
      console.log('Processing signature image...');
      uploadedData.signatureImage = await uploadSingleImage(
        invoiceData.signatureImage,
        `invoices/${userId}/${invoiceId}/signature.jpg`,
        existingInvoice?.signatureImage
      );
    }
    
    // Upload photos
    if (invoiceData.photos && Array.isArray(invoiceData.photos) && invoiceData.photos.length > 0) {
      console.log(`Processing ${invoiceData.photos.length} photos...`);
      uploadedData.photos = await Promise.all(
        invoiceData.photos.map(async (photo, index) => {
          if (photo.url) {
            // Find the corresponding old photo if it exists
            const oldPhoto = existingInvoice?.photos?.find(p => p.id === photo.id);
            const uploadedUrl = await uploadSingleImage(
              photo.url,
              `invoices/${userId}/${invoiceId}/photos/photo_${index}_${photo.id}.jpg`,
              oldPhoto?.url
            );
            return { ...photo, url: uploadedUrl };
          }
          return photo;
        })
      );
      console.log('All photos processed successfully');
    } else {
      uploadedData.photos = [];
    }
    
    console.log('Image upload process completed successfully');
    return uploadedData;
  } catch (error) {
    console.error('Error in uploadInvoiceImages:', error);
    throw error;
  }
};

// Save a new invoice
export const saveInvoice = async (invoiceData, userId) => {
  try {
    console.log('=== SAVING NEW INVOICE ===');
    console.log('Has logo:', !!invoiceData.logoImage);
    console.log('Has signature:', !!invoiceData.signatureImage);
    console.log('Number of photos:', invoiceData.photos?.length || 0);
    
    // First create the document WITHOUT images to get an ID
    const invoiceWithoutImages = {
      ...invoiceData,
      logoImage: null,
      signatureImage: null,
      photos: [],
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating initial document...');
    const docRef = await addDoc(collection(firestore, 'invoices'), invoiceWithoutImages);
    console.log('Document created with ID:', docRef.id);
    
    // Now upload images with the invoice ID
    console.log('Uploading images to R2...');
    const uploadedData = await uploadInvoiceImages(invoiceData, docRef.id, userId);
    
    // Update the document with the image URLs
    console.log('Updating document with image URLs...');
    await updateDoc(doc(firestore, 'invoices', docRef.id), {
      logoImage: uploadedData.logoImage || null,
      signatureImage: uploadedData.signatureImage || null,
      photos: uploadedData.photos || [],
      updatedAt: new Date()
    });
    
    console.log('Invoice saved successfully!');
    console.log('Logo URL:', uploadedData.logoImage?.substring(0, 50));
    console.log('Signature URL:', uploadedData.signatureImage?.substring(0, 50));
    console.log('Photos count:', uploadedData.photos?.length);
    
    return { 
      id: docRef.id, 
      ...invoiceWithoutImages,
      logoImage: uploadedData.logoImage,
      signatureImage: uploadedData.signatureImage,
      photos: uploadedData.photos
    };
  } catch (error) {
    console.error('=== ERROR SAVING INVOICE ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoiceId, invoiceData, userId) => {
  try {
    console.log('=== UPDATING INVOICE ===');
    console.log('Invoice ID:', invoiceId);
    console.log('User ID:', userId);
    console.log('Logo is base64?', invoiceData.logoImage?.startsWith('data:'));
    console.log('Signature is base64?', invoiceData.signatureImage?.startsWith('data:'));
    
    // Get the existing invoice to handle old image cleanup
    const existingInvoice = await getInvoiceById(invoiceId);
    
    // Upload any new images (will skip unchanged URLs and delete old images if new ones are uploaded)
    const uploadedData = await uploadInvoiceImages(invoiceData, invoiceId, userId, existingInvoice);
    
    const invoiceRef = doc(firestore, 'invoices', invoiceId);
    await updateDoc(invoiceRef, {
      ...uploadedData,
      updatedAt: new Date()
    });
    
    console.log('Invoice updated successfully!');
    console.log('New logo URL:', uploadedData.logoImage?.substring(0, 50));
    console.log('New signature URL:', uploadedData.signatureImage?.substring(0, 50));
    
    return { id: invoiceId, ...uploadedData };
  } catch (error) {
    console.error('=== ERROR UPDATING INVOICE ===');
    console.error('Error details:', error);
    throw error;
  }
};

// Get all invoices for a user
export const getUserInvoices = async (userId) => {
  try {
    const q = query(
      collection(firestore, 'invoices'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const invoices = [];
    querySnapshot.forEach((doc) => {
      invoices.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by createdAt on the client side (newest first)
    invoices.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0));
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0));
      return dateB - dateA;
    });
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (invoiceId) => {
  try {
    const invoiceRef = doc(firestore, 'invoices', invoiceId);
    const invoiceSnap = await getDoc(invoiceRef);
    if (invoiceSnap.exists()) {
      return { id: invoiceSnap.id, ...invoiceSnap.data() };
    } else {
      throw new Error('Invoice not found');
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (invoiceId) => {
  try {
    // Get invoice to delete associated images
    const invoice = await getInvoiceById(invoiceId);
    
    // Delete images from R2
    const deletePromises = [];
    
    if (invoice.logoImage && invoice.logoImage.startsWith('http')) {
      try {
        const urlObj = new URL(invoice.logoImage);
        const path = urlObj.pathname.substring(1);
        deletePromises.push(deleteFromR2(path));
      } catch (e) {
        console.warn('Could not delete logo:', e);
      }
    }
    
    if (invoice.signatureImage && invoice.signatureImage.startsWith('http')) {
      try {
        const urlObj = new URL(invoice.signatureImage);
        const path = urlObj.pathname.substring(1);
        deletePromises.push(deleteFromR2(path));
      } catch (e) {
        console.warn('Could not delete signature:', e);
      }
    }
    
    if (invoice.photos && invoice.photos.length > 0) {
      invoice.photos.forEach(photo => {
        if (photo.url && photo.url.startsWith('http')) {
          try {
            const urlObj = new URL(photo.url);
            const path = urlObj.pathname.substring(1);
            deletePromises.push(deleteFromR2(path));
          } catch (e) {
            console.warn('Could not delete photo:', e);
          }
        }
      });
    }
    
    // Wait for all deletions (but don't fail if they error)
    await Promise.allSettled(deletePromises);
    
    // Delete the Firestore document
    await deleteDoc(doc(firestore, 'invoices', invoiceId));
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};