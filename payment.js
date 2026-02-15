// Paystack Payment Module with Backend Integration
// This module handles all payment processing with Paystack

class PaystackPayment {
    constructor() {
        // Paystack configuration
        this.publicKey = 'pk_live_ae6e4053a84a33d802ef561a3e62af667f69231e';
        this.currency = 'GHS';
        this.transactions = [];
        
        // Backend configuration
        // Automatically uses the current domain for API calls
        this.backendURL = window.location.origin;
        
        this.init();
    }

    // Initialize Paystack
    init() {
        console.log('Paystack Payment Module Initialized');
        this.loadTransactionHistory();
    }

    // Process Payment
    async processPayment(paymentData) {
        // Validate payment data
        if (!this.validatePaymentData(paymentData)) {
            console.error('Invalid payment data');
            return false;
        }

        // Generate temporary email using phone number (required by Paystack)
        const tempEmail = `phone_${paymentData.phone}@bundles.local`;

        // Prepare payment object
        const payment = {
            key: this.publicKey,
            email: 'solomonbillion433@gmail.com',
            amount: Math.round(paymentData.amount * 100),
            ref: this.generateReference(),
            currency: this.currency,
            onClose: () => this.handlePaymentClose(),
            onSuccess: (response) => this.handlePaymentSuccess(response, paymentData)
        };

        // Initialize Paystack
        const handler = PaystackPop.setup(payment);
        handler.openIframe();
    }

    // Generate unique reference
    generateReference() {
        return 'ref_' + Math.random().toString(36).substr(2, 9) + Date.now();
    }

    // Validate payment data
    validatePaymentData(data) {
        if (!data.phone || data.phone.length < 10) {
            console.error('Invalid phone number');
            return false;
        }

        if (!data.amount || data.amount <= 0) {
            console.error('Invalid amount');
            return false;
        }

        if (!data.bundle || !data.bundle.id) {
            console.error('Invalid bundle');
            return false;
        }

        return true;
    }

    // Handle payment close
    handlePaymentClose() {
        console.log('Payment process closed by user');
        alert('Payment window closed. Please try again.');
    }

    // Handle payment success
    async handlePaymentSuccess(response, paymentData) {
        console.log('Payment successful:', response);

        // Create transaction record
        const transaction = {
            reference: response.reference,
            customer: {
                phone: paymentData.phone
            },
            bundle: {
                id: paymentData.bundle.id,
                name: paymentData.bundle.name,
                data: paymentData.bundle.data,
                price: paymentData.bundle.price,
                validity: paymentData.bundle.validity
            },
            amount: paymentData.amount,
            currency: this.currency,
            status: 'success',
            timestamp: new Date().toISOString()
        };

        // Save transaction locally
        this.saveTransaction(transaction);

        // Send transaction to backend for persistent storage
        await this.sendTransactionToBackend(transaction);

        // Show success message
        this.showSuccessMessage(transaction);

        // Trigger success callback if exists (call handlePaymentSuccess from index.js)
        if (window.handlePaymentSuccess) {
            window.handlePaymentSuccess(transaction);
        }

        return transaction;
    }

    // Save transaction locally
    saveTransaction(transaction) {
        try {
            const existing = JSON.parse(localStorage.getItem('bundleTransactions') || '[]');
            existing.push(transaction);
            localStorage.setItem('bundleTransactions', JSON.stringify(existing));
            console.log('Transaction saved locally');
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    }

    // Load transaction history from local storage
    loadTransactionHistory() {
        try {
            const stored = localStorage.getItem('bundleTransactions');
            this.transactions = stored ? JSON.parse(stored) : [];
            console.log('Loaded', this.transactions.length, 'transactions from localStorage');
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.transactions = [];
        }
    }

    // Show success message
    showSuccessMessage(transaction) {
        const message = `
            ✅ Payment Successful!
            
            Reference: ${transaction.reference}
            
            Bundle: ${transaction.bundle.name} (${transaction.bundle.data})
            Amount: ${this.currency} ${transaction.amount.toFixed(2)}
            Phone: ${transaction.customer.phone}
            
            Your bundle will be sent to ${transaction.customer.phone} shortly.
        `;

        alert(message);
    }

    // Verify payment with backend (optional)
    async verifyPayment(reference) {
        try {
            const response = await fetch(`${this.backendURL}/api/verify-payment/${reference}`);
            const data = await response.json();
            return data.status === 'success';
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    }

    // Send transaction to backend (persistent storage + live payment tracking)
    async sendTransactionToBackend(transaction) {
        try {
            console.log('📤 Sending transaction to backend...');
            
            const backendData = {
                reference: transaction.reference,
                phone: transaction.customer.phone,
                amount: transaction.amount,
                bundle: transaction.bundle
            };

            const response = await fetch(`${this.backendURL}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(backendData)
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Transaction saved to backend:', data.transaction);
                return data;
            } else {
                console.warn('⚠️ Backend response:', data.message);
                return null;
            }
        } catch (error) {
            console.error('❌ Error sending to backend:', error);
            console.warn('💡 Make sure backend is running at:', this.backendURL);
            return null;
        }
    }

    // Format currency
    formatCurrency(amount) {
        return `${this.currency} ${parseFloat(amount).toFixed(2)}`;
    }
}

// Initialize Paystack Payment instance globally
const paystackPayment = new PaystackPayment();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaystackPayment;
}
