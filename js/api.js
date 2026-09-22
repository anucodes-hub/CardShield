/* CARDShield - REST API Service Layer */

import { CONFIG } from './config.js';
import { INITIAL_TRANSACTIONS, evaluateTransactionRisk } from './mockData.js';

// In-Memory Database for Mock Mode
let mockDatabase = [...INITIAL_TRANSACTIONS];

export const API = {
  /**
   * Submit Payment Transaction -> POST /api/pay
   */
  async pay(paymentData) {
    if (CONFIG.USE_MOCK_DATA) {
      return this._mockPay(paymentData);
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed. Using mock fallback.', err);
      return this._mockPay(paymentData);
    }
  },

  /**
   * Verify OTP -> POST /api/verify-otp
   */
  async verifyOTP(payload) {
    if (CONFIG.USE_MOCK_DATA) {
      return this._mockVerifyOTP(payload);
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed. Using mock fallback.', err);
      return this._mockVerifyOTP(payload);
    }
  },

  /**
   * Get All Transactions -> GET /api/transactions
   */
  async getTransactions() {
    if (CONFIG.USE_MOCK_DATA) {
      return { success: true, data: mockDatabase };
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/transactions`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed. Using mock fallback.', err);
      return { success: true, data: mockDatabase };
    }
  },

  /**
   * Get Fraud Alerts -> GET /api/fraud-alerts
   */
  async getFraudAlerts() {
    if (CONFIG.USE_MOCK_DATA) {
      const alerts = mockDatabase.filter(t => t.riskLevel === 'HIGH' || t.status === 'BLOCKED');
      return { success: true, count: alerts.length, data: alerts };
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/fraud-alerts`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed. Using mock fallback.', err);
      const alerts = mockDatabase.filter(t => t.riskLevel === 'HIGH' || t.status === 'BLOCKED');
      return { success: true, count: alerts.length, data: alerts };
    }
  },

  /**
   * Get Dashboard Metrics -> GET /api/dashboard-stats
   */
  async getDashboardStats() {
    if (CONFIG.USE_MOCK_DATA) {
      return this._calculateStats();
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/dashboard-stats`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed. Using mock fallback.', err);
      return this._calculateStats();
    }
  },

  /**
   * Get Customer Specific History -> GET /api/customer/:id/transactions
   */
  async getCustomerTransactions(customerId) {
    if (CONFIG.USE_MOCK_DATA) {
      const filtered = mockDatabase.filter(t => t.customerId === customerId || customerId === 'all');
      return { success: true, customerId, data: filtered };
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/customer/${customerId}/transactions`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed. Using mock fallback.', err);
      const filtered = mockDatabase.filter(t => t.customerId === customerId);
      return { success: true, customerId, data: filtered };
    }
  },

  /* ---------------- MOCK HANDLERS ---------------- */

  _mockPay(data) {
    const riskEval = evaluateTransactionRisk(data);
    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction = {
      id: txnId,
      customerId: 'CUST-8801',
      customerName: 'Alexander Wright',
      cardNumber: '•••• •••• •••• ' + (data.cardNumber ? data.cardNumber.slice(-4) : '4242'),
      amount: parseFloat(data.amount) || 0,
      merchant: data.merchant || 'General Merchant',
      location: data.location || 'Local Terminal',
      timestamp: now,
      ...riskEval
    };

    mockDatabase.unshift(transaction);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          transaction
        });
      }, 400);
    });
  },

  _mockVerifyOTP({ transactionId, otp, currentAttempts }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const txnIndex = mockDatabase.findIndex(t => t.id === transactionId);
        
        if (otp === CONFIG.DEFAULT_OTP) {
          // Success OTP
          if (txnIndex !== -1) {
            mockDatabase[txnIndex].status = 'APPROVED';
            mockDatabase[txnIndex].otpVerified = true;
          }
          resolve({
            success: true,
            status: 'APPROVED',
            message: 'OTP Verified successfully. Transaction Approved!',
            transaction: mockDatabase[txnIndex]
          });
        } else {
          // Incorrect OTP
          const attemptsRemaining = currentAttempts - 1;
          let newStatus = 'OTP_REQUIRED';

          if (attemptsRemaining <= 0) {
            newStatus = 'BLOCKED';
            if (txnIndex !== -1) {
              mockDatabase[txnIndex].status = 'BLOCKED';
              mockDatabase[txnIndex].riskLevel = 'HIGH';
              mockDatabase[txnIndex].fraudReason = '3 Failed OTP Verification Attempts (Account Security Protocol)';
            }
          }

          resolve({
            success: false,
            status: newStatus,
            attemptsRemaining,
            message: attemptsRemaining <= 0
              ? 'Transaction BLOCKED due to 3 incorrect OTP attempts.'
              : `Incorrect OTP. You have ${attemptsRemaining} attempt(s) remaining.`,
            transaction: txnIndex !== -1 ? mockDatabase[txnIndex] : null
          });
        }
      }, 400);
    });
  },

  _calculateStats() {
    const total = mockDatabase.length;
    const approved = mockDatabase.filter(t => t.status === 'APPROVED' || t.status === 'OTP_VERIFIED').length;
    const otpRequired = mockDatabase.filter(t => t.status === 'OTP_REQUIRED' || t.otpRequired).length;
    const blocked = mockDatabase.filter(t => t.status === 'BLOCKED').length;
    const fraudAlerts = mockDatabase.filter(t => t.riskLevel === 'HIGH' || t.status === 'BLOCKED').length;

    return {
      success: true,
      data: {
        totalTransactions: total,
        approvedCount: approved,
        otpRequiredCount: otpRequired,
        blockedCount: blocked,
        fraudAlertsCount: fraudAlerts
      }
    };
  }
};
