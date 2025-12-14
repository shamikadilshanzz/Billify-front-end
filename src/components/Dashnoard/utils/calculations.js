// src/components/UserDash/utils/calculations.js

export const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };
  
  export const calculateDiscount = (subtotal, discountType, discountValue) => {
    if (discountType === 'percentage') {
      return (subtotal * (parseFloat(discountValue) || 0)) / 100;
    }
    return parseFloat(discountValue) || 0;
  };
  
  export const calculateTotal = (subtotal, discountPrice) => {
    const total = subtotal - discountPrice;
    return isNaN(total) ? 0 : total;
  };
  
  export const calculateUpcomingTotal = (upcomingItems) => {
    return upcomingItems.reduce((s, it) => s + (parseFloat(it.price) || 0), 0);
  };
  
  export const calculateRemainingBeforeUpcoming = (packagePrice, balanceDue) => {
    return parseFloat(packagePrice || 0) - parseFloat(balanceDue || 0);
  };
  
  export const calculateRemainingAfterUpcoming = (packagePrice, balanceDue, upcomingTotal) => {
    return parseFloat(packagePrice || 0) - parseFloat(balanceDue || 0) - parseFloat(upcomingTotal || 0);
  };
  
  export const calculateAvailableForUpcoming = (remainingBeforeUpcoming) => {
    return Math.max(0, remainingBeforeUpcoming);
  };
  
  export const calculateItemAmount = (rate, qty) => {
    const r = parseFloat(rate) || 0;
    const q = parseFloat(qty) || 0;
    return r * q;
  };