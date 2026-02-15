import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Setup static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '..');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(frontendPath));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mtn-bundles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB connected successfully');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    reference: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    bundle: {
        id: Number,
        name: String,
        data: String,
        price: Number,
        validity: String
    },
    amount: { type: Number, required: true },
    currency: String,
    status: { type: String, default: 'pending' }, // pending, success, failed
    paymentVerified: { type: Boolean, default: false },
    paystackResponse: Object,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes

// 1. Create Payment Transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { phone, amount, bundle, reference } = req.body;

        if (!phone || !amount || !bundle) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const transaction = new Transaction({
            reference,
            phone,
            amount,
            bundle,
            currency: 'GHS',
            status: 'pending'
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            transaction: transaction._id
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message
        });
    }
});

// 2. Verify Payment with Paystack
app.get('/api/verify-payment/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        // Verify with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const paystackData = response.data.data;

        if (paystackData.status === 'success') {
            // Update transaction in database
            const transaction = await Transaction.findOneAndUpdate(
                { reference: reference },
                {
                    status: 'success',
                    paymentVerified: true,
                    paystackResponse: paystackData,
                    updatedAt: new Date()
                },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Payment verified successfully',
                transaction: transaction,
                status: 'success'
            });
        } else {
            res.json({
                success: false,
                message: 'Payment not verified',
                status: paystackData.status
            });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
});

// 3. Paystack Webhook - Receive Live Payment Notifications
app.post('/api/webhooks/paystack', async (req, res) => {
    try {
        const event = req.body;
        const reference = event.data.reference;

        console.log('📨 Webhook received for reference:', reference);

        if (event.event === 'charge.success') {
            // Update transaction
            const transaction = await Transaction.findOneAndUpdate(
                { reference: reference },
                {
                    status: 'success',
                    paymentVerified: true,
                    paystackResponse: event.data,
                    updatedAt: new Date()
                },
                { new: true }
            );

            console.log('✅ Payment successful for phone:', transaction.phone);
            console.log('📦 Bundle:', transaction.bundle.name);
            console.log('💰 Amount: GHS', transaction.amount);

            // TODO: Send bundle to customer (SMS/WhatsApp)
            // await sendBundleToCustomer(transaction);
        }

        // Always respond with 200 to acknowledge webhook
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Get All Transactions (Admin Dashboard)
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        
        const stats = {
            total: transactions.length,
            successful: transactions.filter(t => t.status === 'success').length,
            pending: transactions.filter(t => t.status === 'pending').length,
            failed: transactions.filter(t => t.status === 'failed').length,
            totalRevenue: transactions
                .filter(t => t.status === 'success')
                .reduce((sum, t) => sum + t.amount, 0)
        };

        res.json({
            success: true,
            stats: stats,
            transactions: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
});

// 5. Get Single Transaction
app.get('/api/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            transaction: transaction
        });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: error.message
        });
    }
});

// 6. Get Transactions by Phone
app.get('/api/transactions/phone/:phone', async (req, res) => {
    try {
        const transactions = await Transaction.find({ phone: req.params.phone });
        
        res.json({
            success: true,
            transactions: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
});

// 7. Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is running',
        timestamp: new Date()
    });
});

// Catch-all route for frontend (serve index.html for all non-API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📡 Backend API: http://localhost:${PORT}/api\n`);
    console.log(`📝 API Endpoints:`);
    console.log(`   POST   /api/transactions - Create transaction`);
    console.log(`   GET    /api/verify-payment/:reference - Verify payment`);
    console.log(`   POST   /api/webhooks/paystack - Paystack webhook`);
    console.log(`   GET    /api/transactions - Get all transactions`);
    console.log(`   GET    /api/transactions/:id - Get single transaction`);
    console.log(`   GET    /api/transactions/phone/:phone - Get by phone\n`);
});
