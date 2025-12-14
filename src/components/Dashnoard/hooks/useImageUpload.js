// src/components/UserDash/hooks/useImageUpload.js

import { useState, useEffect } from 'react';

export const useImageUpload = (initialInvoiceData, invoiceId) => {
  const [logoImage, setLogoImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Load images if editing
  useEffect(() => {
    if (initialInvoiceData && invoiceId) {
      setLogoImage(initialInvoiceData.logoImage || null);
      setSignatureImage(initialInvoiceData.signatureImage || null);
      setPhotos(initialInvoiceData.photos || []);
    }
  }, [initialInvoiceData, invoiceId]);

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