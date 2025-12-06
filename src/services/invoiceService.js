import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { firestore } from '../infrastructure/db/firebaseConfig';

// Save a new invoice
export const saveInvoice = async (invoiceData, userId) => {
  try {
    const invoiceWithUser = {
      ...invoiceData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(collection(firestore, 'invoices'), invoiceWithUser);
    return { id: docRef.id, ...invoiceWithUser };
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const invoiceRef = doc(firestore, 'invoices', invoiceId);
    await updateDoc(invoiceRef, {
      ...invoiceData,
      updatedAt: new Date()
    });
    return { id: invoiceId, ...invoiceData };
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

// Get all invoices for a user
export const getUserInvoices = async (userId) => {
  try {
    // Query without orderBy to avoid requiring a composite index
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
      return dateB - dateA; // Descending order (newest first)
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

