/* CARDShield - Customer Views Renderer */

import { Store } from '../store.js';
import { API } from '../api.js';

export const CustomerViews = {
  /**
   * Render Customer Login Page
   */
  renderLogin(container) {
    container.innerHTML = `
      <div class="customer-container fade-in">
        <div class="portal-welcome">
          <h2>Customer Portal</h2>
          <p>Access your secure banking session to process payments with real-time risk assessment.</p>
        </div>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Customer Authentication</h3>
            <span class="badge badge-info"><span class="risk-dot"></span>Secure SSL</span>
          </div>
          <form id="customer-login-form">
            <div class="form-group">
              <label class="form-label" for="login-id">Customer Account ID</label>
              <input type="text" id="login-id" class="form-input" value="CUST-8801" placeholder="e.g. CUST-8801" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-name">Cardholder Name</label>
              <input type="text" id="login-name" class="form-input" value="Alexander Wright" placeholder="Full name on card" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">
              <span>Authenticate Session</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('customer-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('login-id').value;
      const name = document.getElementById('login-name').value;
      Store.setState({
        customerUser: { id, name },
        activeView: 'payment-portal'
      });
    });
  },

  /**
   * Render Payment Portal (Form + Real-Time Card Preview)
   */
  renderPaymentPortal(container) {
    const state = Store.getState();
    const user = state.customerUser;

    container.innerHTML = `
      <div class="customer-container fade-in">
        <div class="portal-welcome">
          <h2>Real-Time Payment Gateway</h2>
          <p>Enter details below to test CARDShield AI Fraud & Risk Analysis.</p>
        </div>

        <!-- Interactive Credit Card Graphic -->
        <div class="credit-card-preview" id="credit-card-widget">
          <div class="card-top">
            <div class="card-chip"></div>
            <span class="card-brand-logo">CARDShield</span>
          </div>
          <div class="card-number-display" id="card-num-display">4242 •••• •••• 4242</div>
          <div class="card-bottom">
            <div>
              <div class="card-label">CARD HOLDER</div>
              <div class="card-val" id="card-name-display">${user.name || 'Alexander Wright'}</div>
            </div>
            <div>
              <div class="card-label">EXPIRES</div>
              <div class="card-val" id="card-exp-display">12/28</div>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Payment Details</h3>
            <span class="badge badge-info">256-Bit Encrypted</span>
          </div>

          <form id="payment-form">
            <div class="payment-form-grid">
              <div class="form-group full-width">
                <label class="form-label" for="pay-card">Credit Card Number</label>
                <input type="text" id="pay-card" class="form-input font-mono" maxlength="19" placeholder="4242 8819 3012 4242" value="4242 8819 3012 4242" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="pay-amount">Amount (USD $)</label>
                <input type="number" step="0.01" id="pay-amount" class="form-input font-mono" placeholder="150.00" value="150.00" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="pay-exp">Expiry / CVV</label>
                <input type="text" id="pay-exp" class="form-input font-mono" value="12/28" placeholder="12/28" required>
              </div>

              <div class="form-group full-width">
                <label class="form-label" for="pay-merchant">Merchant Name</label>
                <input type="text" id="pay-merchant" class="form-input" placeholder="e.g. Amazon, Apple Store, Crypto Exchange" value="Amazon US" required>
              </div>

              <div class="form-group full-width">
                <label class="form-label" for="pay-location">Transaction Origin Location</label>
                <input type="text" id="pay-location" class="form-input" placeholder="e.g. New York, USA or Lagos, Nigeria" value="New York, USA" required>
              </div>
            </div>

            <!-- Quick Preset Buttons for Easy Demo Testing -->
            <div style="margin: 0.5rem 0 1.25rem;">
              <span class="text-xs text-tertiary" style="display: block; margin-bottom: 0.4rem;">Demo Test Scenarios:</span>
              <div class="flex gap-2" style="flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary text-xs" id="demo-low">Low Risk ($45 - Amazon)</button>
                <button type="button" class="btn btn-secondary text-xs" id="demo-med">Medium Risk ($850 - Crypto)</button>
                <button type="button" class="btn btn-secondary text-xs" id="demo-high">High Risk ($12,500 - Nigeria)</button>
              </div>
            </div>

            <button type="submit" id="pay-submit-btn" class="btn btn-primary btn-block">
              <span>Evaluate & Process Payment</span>
            </button>
          </form>
        </div>
      </div>
    `;

    // Interactive Card Number Input Formatting
    const cardInput = document.getElementById('pay-card');
    const cardNumDisplay = document.getElementById('card-num-display');
    const merchantInput = document.getElementById('pay-merchant');
    const locationInput = document.getElementById('pay-location');
    const amountInput = document.getElementById('pay-amount');

    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = formatted;
      cardNumDisplay.textContent = formatted || '•••• •••• •••• ••••';
    });

    // Preset Buttons Handlers
    document.getElementById('demo-low').addEventListener('click', () => {
      amountInput.value = '45.00';
      merchantInput.value = 'Amazon Fresh';
      locationInput.value = 'New York, USA';
    });

    document.getElementById('demo-med').addEventListener('click', () => {
      amountInput.value = '850.00';
      merchantInput.value = 'Crypto Trading Platform';
      locationInput.value = 'London, UK';
    });

    document.getElementById('demo-high').addEventListener('click', () => {
      amountInput.value = '12500.00';
      merchantInput.value = 'Luxury Watch Boutique';
      locationInput.value = 'Lagos, Nigeria';
    });

    // Form Submission -> API.pay
    document.getElementById('payment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('pay-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> <span>Calculating Risk Score...</span>`;

      const payload = {
        cardNumber: cardInput.value,
        amount: amountInput.value,
        merchant: merchantInput.value,
        location: locationInput.value
      };

      const result = await API.pay(payload);
      const txn = result.transaction;

      Store.resetOTP();

      if (txn.status === 'OTP_REQUIRED') {
        Store.setState({
          pendingTransaction: txn,
          activeView: 'otp-verification'
        });
      } else {
        Store.setState({
          lastTransaction: txn,
          activeView: 'payment-result'
        });
      }
    });
  },

  /**
   * Render OTP Verification View / Modal
   */
  renderOTP(container) {
    const state = Store.getState();
    const txn = state.pendingTransaction;
    const attempts = state.otpAttemptsLeft;

    if (!txn) {
      Store.setView('payment-portal');
      return;
    }

    container.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content otp-container fade-in">
          <div class="otp-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3>OTP Verification Required</h3>
          <p class="text-sm text-secondary" style="margin-top: 0.35rem;">
            Risk Score: <strong style="color: var(--risk-medium);">${txn.riskScore}/100 (MEDIUM)</strong><br>
            A 6-digit authentication code was sent for transaction <strong>$${txn.amount.toFixed(2)}</strong> at <strong>${txn.merchant}</strong>.
          </p>
          <div class="attempts-badge">
            Attempts remaining: <span id="attempts-count">${attempts}</span> / 3
          </div>

          <form id="otp-form" style="margin-top: 1rem;">
            <div class="otp-inputs">
              <input type="text" maxlength="1" class="otp-digit" required autofocus>
              <input type="text" maxlength="1" class="otp-digit" required>
              <input type="text" maxlength="1" class="otp-digit" required>
              <input type="text" maxlength="1" class="otp-digit" required>
              <input type="text" maxlength="1" class="otp-digit" required>
              <input type="text" maxlength="1" class="otp-digit" required>
            </div>

            <p class="text-xs text-tertiary" style="margin-bottom: 1rem;">
              (Demo Master OTP: <strong>123456</strong>)
            </p>

            <div id="otp-error-msg" class="alert-box alert-danger hidden"></div>

            <div class="flex gap-2">
              <button type="button" id="cancel-otp-btn" class="btn btn-secondary flex-1">Cancel</button>
              <button type="submit" id="submit-otp-btn" class="btn btn-primary flex-1">Verify OTP</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Digit auto-advance UX
    const digits = document.querySelectorAll('.otp-digit');
    digits.forEach((digit, index) => {
      digit.addEventListener('keyup', (e) => {
        if (e.key >= '0' && e.key <= '9') {
          if (index < digits.length - 1) digits[index + 1].focus();
        } else if (e.key === 'Backspace') {
          if (index > 0) digits[index - 1].focus();
        }
      });
      // Paste full OTP code handler
      digit.addEventListener('paste', (e) => {
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
          pasteData.split('').forEach((char, i) => {
            if (digits[i]) digits[i].value = char;
          });
          digits[5].focus();
        }
      });
    });

    document.getElementById('cancel-otp-btn').addEventListener('click', () => {
      Store.setView('payment-portal');
    });

    // Form Submission -> API.verifyOTP
    document.getElementById('otp-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const otpCode = Array.from(digits).map(d => d.value).join('');
      const submitBtn = document.getElementById('submit-otp-btn');
      const errorMsg = document.getElementById('otp-error-msg');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> Verifying...`;
      errorMsg.classList.add('hidden');

      const result = await API.verifyOTP({
        transactionId: txn.id,
        otp: otpCode,
        currentAttempts: Store.getState().otpAttemptsLeft
      });

      if (result.success) {
        Store.setState({
          lastTransaction: result.transaction,
          pendingTransaction: null,
          activeView: 'payment-result'
        });
      } else {
        const newAttempts = result.attemptsRemaining;
        Store.setState({ otpAttemptsLeft: newAttempts });

        if (newAttempts <= 0) {
          Store.setState({
            lastTransaction: result.transaction,
            pendingTransaction: null,
            activeView: 'payment-result'
          });
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Verify OTP';
          errorMsg.textContent = result.message;
          errorMsg.classList.remove('hidden');
          document.getElementById('attempts-count').textContent = newAttempts;
          digits.forEach(d => d.value = '');
          digits[0].focus();
        }
      }
    });
  },

  /**
   * Render Payment Result Receipt
   */
  renderResult(container) {
    const state = Store.getState();
    const txn = state.lastTransaction;

    if (!txn) {
      Store.setView('payment-portal');
      return;
    }

    const isApproved = txn.status === 'APPROVED' || txn.status === 'OTP_VERIFIED';
    const isBlocked = txn.status === 'BLOCKED';

    let headerBgClass = isApproved ? 'status-approved-bg' : 'status-blocked-bg';
    let circleClass = isApproved ? 'approved-circle' : 'blocked-circle';
    let statusText = isApproved ? 'TRANSACTION APPROVED' : 'TRANSACTION BLOCKED';
    let badgeClass = isApproved ? 'badge-low' : (txn.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-high');
    let barColor = isApproved ? 'var(--risk-low)' : (txn.riskLevel === 'MEDIUM' ? 'var(--risk-medium)' : 'var(--risk-high)');

    container.innerHTML = `
      <div class="customer-container fade-in">
        <div class="card receipt-card">
          <div class="receipt-status-header ${headerBgClass}">
            <div class="status-icon-circle ${circleClass}">
              ${isApproved ? '✓' : '✕'}
            </div>
            <h2>${statusText}</h2>
            <p class="text-sm" style="margin-top: 0.25rem;">Ref ID: <strong>${txn.id}</strong></p>
          </div>

          <!-- Risk Score Meter -->
          <div style="margin: 1.5rem 0 1rem; text-align: left;">
            <div class="flex justify-between items-center text-sm">
              <span class="font-semibold text-secondary">CARDShield Risk Assessment Score:</span>
              <span class="badge ${badgeClass}">${txn.riskLevel} (${txn.riskScore}/100)</span>
            </div>
            <div class="risk-score-bar-container">
              <div class="risk-score-bar-fill" style="width: ${txn.riskScore}%; background: ${barColor};"></div>
            </div>
            <p class="text-xs text-tertiary">
              Risk Evaluation Reason: <em>${txn.fraudReason}</em>
            </p>
          </div>

          <!-- Transaction Summary Breakdown -->
          <div class="receipt-details-list">
            <div class="receipt-row">
              <span class="text-secondary">Amount Charged</span>
              <span class="font-bold text-lg font-mono" style="color: var(--text-primary);">$${txn.amount.toFixed(2)}</span>
            </div>
            <div class="receipt-row">
              <span class="text-secondary">Merchant</span>
              <span class="font-semibold">${txn.merchant}</span>
            </div>
            <div class="receipt-row">
              <span class="text-secondary">Location Origin</span>
              <span>${txn.location}</span>
            </div>
            <div class="receipt-row">
              <span class="text-secondary">Card Mask</span>
              <span class="font-mono">${txn.cardNumber}</span>
            </div>
            <div class="receipt-row">
              <span class="text-secondary">Timestamp</span>
              <span class="font-mono text-xs">${txn.timestamp}</span>
            </div>
          </div>

          <div class="flex gap-4" style="margin-top: 1.5rem;">
            <button id="btn-new-payment" class="btn btn-primary flex-1">
              <span>New Payment</span>
            </button>
            <button id="btn-goto-admin" class="btn btn-secondary flex-1">
              <span>View in Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-new-payment').addEventListener('click', () => {
      Store.setView('payment-portal');
    });

    document.getElementById('btn-goto-admin').addEventListener('click', () => {
      Store.setPortal('admin');
    });
  }
};
