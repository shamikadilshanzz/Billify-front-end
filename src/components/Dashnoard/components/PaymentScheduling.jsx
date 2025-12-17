// src/components/UserDash/components/PaymentScheduling.jsx

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../userDash.module.css";

export default function PaymentScheduling({
  activeTab,
  total,
  packagePrice,
  upcomingPayments,
  addUpcomingPayment,
  updateUpcomingPayment,
  deleteUpcomingPayment,
  selectedColor,
  isMobile
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentDescription, setPaymentDescription] = useState("");

  /* ================= CALCULATIONS ================= */
  const invoiceTotal = parseFloat(packagePrice || 0);
  const paid = parseFloat(total || 0);

  const upcomingTotal = upcomingPayments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount || 0),
    0
  );

  const amountRemaining = invoiceTotal - paid - upcomingTotal;
  const balanceDue = paid;

  /* ================= HELPERS ================= */
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  /* ================= STATUS COMPONENT ================= */
  const StatusRemaining = () => {
    if (amountRemaining <= 0) return null;

    return (
      <div
        className={styles.balanceRemaining}
        style={{ backgroundColor: selectedColor }}
      >
        <span className={styles.label}>Balance Remaining:</span>
        <span className={styles.amount}>
          Rs. {amountRemaining.toFixed(2)}
        </span>
      </div>
    );
  };

  /* ================= HANDLERS ================= */
  const handleAddPayment = () => {
    setEditingPayment(null);
    setPaymentAmount("");
    setPaymentDate(new Date());
    setPaymentDescription("Payment");
    setShowModal(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentAmount(payment.amount);
    setPaymentDate(new Date(payment.dueDate));
    setPaymentDescription(payment.description || "Payment");
    setShowModal(true);
  };

  const handleSavePayment = () => {
    const amount = parseFloat(paymentAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!editingPayment && amount > amountRemaining) {
      alert(
        `Amount cannot exceed remaining balance of Rs.${amountRemaining.toFixed(
          2
        )}`
      );
      return;
    }

    const paymentData = {
      id: editingPayment?.id || Date.now(),
      amount,
      dueDate: formatDate(paymentDate),
      description: paymentDescription || "Payment"
    };

    if (editingPayment) {
      updateUpcomingPayment(editingPayment.id, paymentData);
    } else {
      addUpcomingPayment(paymentData);
    }

    setShowModal(false);
    setPaymentAmount("");
    setPaymentDate(new Date());
    setPaymentDescription("");
  };

  const handleRequestDeposit = () => {
    if (amountRemaining <= 0) {
      alert("No remaining amount available for deposit");
      return;
    }

    addUpcomingPayment({
      id: Date.now(),
      amount: amountRemaining,
      dueDate: formatDate(new Date()),
      description: "Deposit"
    });
  };

  /* ================= PREVIEW MODE ================= */
  if (activeTab === "Preview") {
    return (
      <div className={styles.paymentSchedulingPreview}>
        {upcomingPayments.length > 0 && (
          <div className={styles.upcomingPaymentsSection}>
            <h4
              className={styles.sectionSubtitle}
              style={{ color: selectedColor }}
            >
              UPCOMING PAYMENTS
            </h4>

            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className={styles.upcomingPaymentItem}
              >
                <div>
                  <div className={styles.paymentDescription}>
                    {payment.description}
                  </div>
                  <div className={styles.paymentDueDate}>
                    Due {payment.dueDate}
                  </div>
                </div>
                <div className={styles.paymentAmount}>
                  Rs.{parseFloat(payment.amount).toFixed(2)}
                </div>
              </div>
            ))}

            {/* ✅ CORRECT */}
            <StatusRemaining />
          </div>
        )}
      </div>
    );
  }

  /* ================= EDIT MODE ================= */
  return (
    <div className={styles.paymentSchedulingEdit}>
      <h3
        className={styles.sectionTitle}
        style={{ color: selectedColor }}
      >
        Payment Scheduling
      </h3>

      <div className={styles.paymentSummaryBox}>
        <div className={styles.summaryRow}>
          <span>Invoice Total</span>
          <span>Rs.{invoiceTotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Paid</span>
          <span>Rs.{paid.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Amount Remaining</span>
          <span>Rs.{amountRemaining.toFixed(2)}</span>
        </div>
        <div
          className={styles.summaryRowBold}
          style={{ color: selectedColor }}
        >
          <span>Balance Due</span>
          <span>Rs.{balanceDue.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.upcomingPaymentsHeader}>
        <h4 className={styles.sectionSubtitle}>Upcoming Payments</h4>
        <div className={styles.paymentActions}>
          <button
            onClick={handleRequestDeposit}
            className={styles.depositButton}
            style={{ background: selectedColor }}
          >
            Request Deposit
          </button>
          <button
            onClick={handleAddPayment}
            className={styles.addPaymentButton}
          >
            Add Upcoming Payment
          </button>
        </div>
      </div>

      {upcomingPayments.length > 0 && (
        <div className={styles.upcomingPaymentsList}>
          {upcomingPayments.map((payment) => (
            <div
              key={payment.id}
              className={styles.upcomingPaymentCard}
            >
              <div className={styles.paymentCardContent}>
                <div>
                  <div className={styles.paymentDescription}>
                    {payment.description}
                  </div>
                  <div className={styles.paymentDueDate}>
                    Due {payment.dueDate}
                  </div>
                </div>
                <div className={styles.paymentCardRight}>
                  <div className={styles.paymentAmount}>
                    Rs.{parseFloat(payment.amount).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleEditPayment(payment)}
                    className={styles.paymentEditBtn}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {editingPayment ? "Edit Payment" : "Add Upcoming Payment"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={styles.modalClose}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Description</label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) =>
                    setPaymentDescription(e.target.value)
                  }
                  className={styles.inputPa}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  step="0.01"
                  className={styles.inputPa}
                />
                {!editingPayment && (
                  <small>
                    Available: Rs.{amountRemaining.toFixed(2)}
                  </small>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Due Date</label>
                <DatePicker
                  selected={paymentDate}
                  onChange={(date) => setPaymentDate(date)}
                  dateFormat="MMM dd, yyyy"
                  className={styles.inputPa}
                />
              </div>

              <div className={styles.modalActions}>
                {editingPayment && (
                  <button
                    onClick={() => {
                      deleteUpcomingPayment(editingPayment.id);
                      setShowModal(false);
                    }}
                    className={styles.deletePaymentBtn}
                  >
                    Delete Payment
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePayment}
                  className={styles.saveBtn}
                  style={{ background: selectedColor }}
                >
                  {editingPayment ? "Update" : "Add"} Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
