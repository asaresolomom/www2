// MTN UP2U Bundle Store - Main JavaScript
// Handles bundle selection, form submission, and payment processing

// Bundle Data
const bundles = [
    {
        id: 1,
        name: "MTN Lite",
        data: "1GB",
        price: 4.60,
        icon: "📲",
        validity: "1 day"
    },
    {
        id: 2,
        name: "MTN Basic",
        data: "2GB",
        price: 8.50,
        icon: "📱",
        validity: "3 days"
    },
    {
        id: 3,
        name: "MTN Standard",
        data: "3GB",
        price: 13.50,
        icon: "🎮",
        validity: "7 days"
    },
    {
        id: 4,
        name: "MTN Plus",
        data: "4GB",
        price: 23.50,
        icon: "⭐",
        validity: "14 days"
    }
];

// Global state
let selectedBundle = null;

// ============================================
// RENDER BUNDLES ON PAGE LOAD
// ============================================

function renderBundles() {
    const container = document.getElementById('bundlesContainer');
    
    container.innerHTML = bundles.map(bundle => `
        <div class="bundle-card" onclick="selectBundle(${bundle.id})">
            <div class="bundle-icon">${bundle.icon}</div>
            <div class="bundle-badge">MTN UP2U</div>
            <h3>${bundle.name}</h3>
            <p class="bundle-data">${bundle.data}</p>
            <p class="bundle-validity">Valid ${bundle.validity}</p>
            <p class="bundle-price">₵${bundle.price.toFixed(2)}</p>
        </div>
    `).join('');

    console.log('✅ Bundles rendered:', bundles.length);
}

// ============================================
// SELECT BUNDLE AND UPDATE DISPLAY
// ============================================

function selectBundle(bundleId) {
    selectedBundle = bundles.find(b => b.id === bundleId);
    
    if (!selectedBundle) {
        console.error('Bundle not found:', bundleId);
        return;
    }

    updateBundleDisplay();
    console.log('✅ Bundle selected:', selectedBundle.name);
}

function updateBundleDisplay() {
    const display = document.getElementById('selectedBundle');
    
    display.innerHTML = `
        <div class="selected-info">
            <span class="selected-icon">${selectedBundle.icon}</span>
            <div class="selected-details">
                <p class="selected-name">${selectedBundle.name}</p>
                <p class="selected-data">${selectedBundle.data} - ₵${selectedBundle.price.toFixed(2)}</p>
            </div>
        </div>
    `;
}

// ============================================
// HANDLE FORM SUBMISSION
// ============================================

function handleCheckout(e) {
    e.preventDefault();

    // Validate bundle selected
    if (!selectedBundle) {
        alert('❌ Please select a bundle first');
        return;
    }

    // Get phone number
    const phone = document.getElementById('phone').value.trim();

    // Validate phone (minimum 10 digits)
    if (phone.length < 10) {
        alert('❌ Please enter a valid phone number (minimum 10 digits)');
        return;
    }

    // Prepare payment data
    const paymentData = {
        phone: phone,
        amount: selectedBundle.price,
        bundle: selectedBundle
    };

    console.log('🔄 Processing payment for:', paymentData);

    // Process payment via Paystack
    paystackPayment.processPayment(paymentData);
}

// ============================================
// HANDLE PAYMENT SUCCESS (Called from payment.js)
// ============================================

function handlePaymentSuccess(transaction) {
    console.log('✅ Payment success - Transaction:', transaction);

    // Reset form
    document.getElementById('checkoutForm').reset();
    document.getElementById('selectedBundle').innerHTML = '<p>Select a bundle to proceed</p>';
    selectedBundle = null;

    // Update display
    updateBundleDisplay();

    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <p>✅ Payment Successful!</p>
        <p>Bundle will be sent to ${transaction.customer.phone}</p>
    `;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 MTN UP2U Bundle Store Loading...');

    // Render bundles
    renderBundles();

    // Attach form handler
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }

    console.log('✅ Page initialized and ready');
});

