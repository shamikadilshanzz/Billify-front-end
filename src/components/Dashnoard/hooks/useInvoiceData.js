// src/components/UserDash/hooks/useInvoiceData.js

import { useState, useEffect } from 'react';
import { DEFAULT_ITEM, DEFAULT_UPCOMING_ITEM, DEFAULT_FORM_DATA, DEFAULT_COLOR } from '../utils/constants';

export const useInvoiceData = (initialInvoiceData, invoiceId) => {
  const [activeTab, setActiveTab] = useState('Preview');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [items, setItems] = useState([DEFAULT_ITEM]);
  const [financingEnabled, setFinancingEnabled] = useState(true);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [packagePrice, setPackagePrice] = useState(0);
  const [upcomingTitle, setUpcomingTitle] = useState("Upcoming Payment");
  const [upcomingDescription, setUpcomingDescription] = useState("");
  const [upcomingItems, setUpcomingItems] = useState([DEFAULT_UPCOMING_ITEM]);
  const [upcomingError, setUpcomingError] = useState("");
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [packageName, setPackageName] = useState(
    initialInvoiceData?.packageName || ''
  );
  
  // Payment Scheduling State
  const [upcomingPayments, setUpcomingPayments] = useState([]);

  // Load invoice data if editing
  useEffect(() => {
    if (initialInvoiceData && invoiceId) {
      setSelectedColor(initialInvoiceData.selectedColor || DEFAULT_COLOR);
      setItems(initialInvoiceData.items || [DEFAULT_ITEM]);
      setFinancingEnabled(initialInvoiceData.financingEnabled !== undefined ? initialInvoiceData.financingEnabled : true);
      setDiscountType(initialInvoiceData.discountType || 'percentage');
      setDiscountValue(initialInvoiceData.discountValue || 0);
      setPackagePrice(initialInvoiceData.packagePrice || 0);
      setUpcomingTitle(initialInvoiceData.upcomingTitle || "Upcoming Payment");
      setUpcomingDescription(initialInvoiceData.upcomingDescription || "");
      setUpcomingItems(initialInvoiceData.upcomingItems || [DEFAULT_UPCOMING_ITEM]);
      setUpcomingPayments(initialInvoiceData.upcomingPayments || []);
      if (initialInvoiceData.formData) {
        setFormData(initialInvoiceData.formData);
      }
    }
  }, [initialInvoiceData, invoiceId]);

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

  const addUpcomingItem = (availableForUpcoming) => {
    setUpcomingError("");
    if (availableForUpcoming <= 0) {
      setUpcomingError("No remaining amount available to add upcoming items.");
      return;
    }
    setUpcomingItems(prev => [...prev, { id: Date.now(), desc: "", price: 0.00 }]);
  };

  const updateUpcomingItem = (id, field, value, availableForUpcoming) => {
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

  // Payment Scheduling Functions
  const addUpcomingPayment = (payment) => {
    setUpcomingPayments(prev => [...prev, payment]);
  };

  const updateUpcomingPayment = (id, updatedPayment) => {
    setUpcomingPayments(prev => 
      prev.map(payment => payment.id === id ? { ...payment, ...updatedPayment } : payment)
    );
  };

  const deleteUpcomingPayment = (id) => {
    setUpcomingPayments(prev => prev.filter(payment => payment.id !== id));
  };

  return {
    activeTab, setActiveTab,
    selectedColor, setSelectedColor,
    items, addItem, deleteItem, updateItem,
    financingEnabled, setFinancingEnabled,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    packagePrice, setPackagePrice,
    packageName, setPackageName,
    upcomingTitle, setUpcomingTitle,
    upcomingDescription, setUpcomingDescription,
    upcomingItems, addUpcomingItem, updateUpcomingItem, deleteUpcomingItem,
    upcomingError,
    formData, updateFormData,
    // Payment Scheduling
    upcomingPayments,
    addUpcomingPayment,
    updateUpcomingPayment,
    deleteUpcomingPayment
  };
};