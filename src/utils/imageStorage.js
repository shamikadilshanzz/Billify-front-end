import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../infrastructure/db/firebaseConfig';

// Upload base64 image to Firebase Storage and return the download URL
export const uploadImageToStorage = async (base64Image, path) => {
  if (!base64Image) return null;
  
  try {
    const storageRef = ref(storage, path);
    
    // Upload the base64 string
    await uploadString(storageRef, base64Image, 'data_url');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete image from Firebase Storage
export const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // Extract the path from the URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image might already be deleted
  }
};