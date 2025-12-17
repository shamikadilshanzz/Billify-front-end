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
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../infrastructure/db/firebaseConfig';

// Helper function to upload a single image
const uploadSingleImage = async (base64Image, path) => {
  if (!base64Image) {
    console.log('No image provided for path:', path);
    return null;
  }
  
  // Check if it's a base64 string or already a URL
  if (!base64Image.startsWith('data:')) {
    console.log('Image is already a URL:', base64Image.substring(0, 50) + '...');
    return base64Image; // Already uploaded, return as-is
  }
  
  try {
    console.log(`Uploading image to ${path}...`);
    const storageRef = ref(storage, path);
    
    // Upload the base64 string
    await uploadString(storageRef, base64Image, 'data_url');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`Image uploaded successfully: ${downloadURL.substring(0, 50)}...`);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading image to ${path}:`, error);
    throw error;
  }
};

// Helper function to upload images
const uploadInvoiceImages = async (invoiceData, invoiceId, userId) => {
  console.log('Starting image upload process...');
  const uploadedData = { ...invoiceData };
  
  try {
    // Upload logo
    if (invoiceData.logoImage) {
      console.log('Processing logo image...');
      uploadedData.logoImage = await uploadSingleImage(
        invoiceData.logoImage,
        `invoices/${userId}/${invoiceId}/logo.jpg`
      );
    }
    
    // Upload signature
    if (invoiceData.signatureImage) {
      console.log('Processing signature image...');
      uploadedData.signatureImage = await uploadSingleImage(
        invoiceData.signatureImage,
        `invoices/${userId}/${invoiceId}/signature.jpg`
      );
    }
    
    // Upload photos
    if (invoiceData.photos && Array.isArray(invoiceData.photos) && invoiceData.photos.length > 0) {
      console.log(`Processing ${invoiceData.photos.length} photos...`);
      uploadedData.photos = await Promise.all(
        invoiceData.photos.map(async (photo, index) => {
          if (photo.url) {
            const uploadedUrl = await uploadSingleImage(
              photo.url,
              `invoices/${userId}/${invoiceId}/photos/photo_${index}_${photo.id}.jpg`
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
    console.log('Uploading images...');
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
    console.error('Error code:', error.code);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoiceId, invoiceData, userId) => {
  try {
    console.log('=== UPDATING INVOICE ===');
    console.log('Invoice ID:', invoiceId);
    console.log('User ID:', userId);
    
    // Upload any new images
    const uploadedData = await uploadInvoiceImages(invoiceData, invoiceId, userId);
    
    const invoiceRef = doc(firestore, 'invoices', invoiceId);
    await updateDoc(invoiceRef, {
      ...uploadedData,
      updatedAt: new Date()
    });
    
    console.log('Invoice updated successfully!');
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
    await deleteDoc(doc(firestore, 'invoices', invoiceId));
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};