import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configure R2 client
const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL; // Your R2 public domain

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Helper function to convert base64 to Uint8Array (browser-compatible)
const base64ToUint8Array = (base64String) => {
  // Remove the data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  
  // Decode base64 to binary string
  const binaryString = atob(base64Data);
  
  // Convert binary string to Uint8Array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes;
};

// Helper function to get content type from base64 string
const getContentType = (base64String) => {
  const match = base64String.match(/^data:image\/(\w+);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
};

// Upload a single image to R2
export const uploadToR2 = async (base64Image, path) => {
  if (!base64Image) {
    console.log('No image provided for path:', path);
    return null;
  }
  
  // Check if it's already a URL
  if (!base64Image.startsWith('data:')) {
    console.log('Image is already a URL:', base64Image.substring(0, 50) + '...');
    return base64Image;
  }
  
  try {
    console.log(`Uploading image to R2: ${path}...`);
    
    // Convert to Uint8Array instead of Buffer (browser-compatible)
    const uint8Array = base64ToUint8Array(base64Image);
    const contentType = getContentType(base64Image);
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: path,
      Body: uint8Array,
      ContentType: contentType,
    });
    
    await r2Client.send(command);
    
    // Construct the public URL
    const publicUrl = `${R2_PUBLIC_URL}/${path}`;
    console.log(`Image uploaded successfully: ${publicUrl.substring(0, 50)}...`);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading image to R2 (${path}):`, error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Delete an image from R2
export const deleteFromR2 = async (path) => {
  try {
    console.log(`Deleting image from R2: ${path}...`);
    
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: path,
    });
    
    await r2Client.send(command);
    console.log('Image deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting image from R2 (${path}):`, error);
    throw error;
  }
};

// Helper function to compress images before upload
export const compressBase64Image = (base64, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = (error) => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = base64;
  });
};