// src/components/UserDash/hooks/useImageUpload.js

import { useState, useEffect } from 'react';

export const useImageUpload = (initialInvoiceData, invoiceId) => {
  const [logoImage, setLogoImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Load images if editing
  useEffect(() => {
    if (initialInvoiceData && invoiceId) {
      console.log('Loading existing images for invoice:', invoiceId);
      setLogoImage(initialInvoiceData.logoImage || null);
      setSignatureImage(initialInvoiceData.signatureImage || null);
      setPhotos(initialInvoiceData.photos || []);
    }
  }, [initialInvoiceData, invoiceId]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('New logo selected, converting to base64...');
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('Logo converted to base64');
        setLogoImage(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading logo file:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('New signature selected, converting to base64...');
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('Signature converted to base64');
        setSignatureImage(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading signature file:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log(`${files.length} new photo(s) selected, converting to base64...`);
    
    // Use Promise.all to handle multiple files properly
    const photoPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            id: `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            url: event.target.result,
            name: file.name
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const newPhotos = await Promise.all(photoPromises);
      console.log(`${newPhotos.length} photo(s) converted to base64`);
      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      console.error('Error reading photo files:', error);
      alert('Failed to upload some photos. Please try again.');
    }
  };

  const removePhoto = (id) => {
    console.log('Removing photo:', id);
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  return {
    logoImage,
    signatureImage,
    photos,
    handleLogoUpload,
    handleSignatureUpload,
    handlePhotosUpload,
    removePhoto
  };
};