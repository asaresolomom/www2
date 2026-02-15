# MTN UP2U Backend - Node.js Express Server

Complete backend for processing live payments with Paystack integration.

## 📋 Features

✅ Create transactions with Paystack reference  
✅ Verify payments with Paystack API  
✅ Receive Paystack webhooks for real-time updates  
✅ Store all transactions in MongoDB  
✅ Get transaction statistics  
✅ Admin dashboard ready  

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Update .env Configuration

Open `backend/.env` and add:

```
# Get from paystack.com > Settings > API Keys & Webhooks
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# Update these
FRONTEND_URL=http://localhost:8000
PORT=3000

# MongoDB (local or cloud)
MONGODB_URI=mongodb://localhost:27017/mtn-bundles
```

### Step 3: Setup MongoDB Locally

**Option A: Install MongoDB Locally**
- Download from https://www.mongodb.com/try/download/community
- Install and run MongoDB service

**Option B: Use MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/mtn-bundles`
5. Update `MONGODB_URI` in .env

### Step 4: Run Backend

```bash
# Development mode (auto-reload)
npm run dev

# Or production mode
npm start
```

Server will run on: `http://localhost:3000`

## 🔗 API Endpoints

### 1. Create Transaction
```
POST /api/transactions
Body: {
  "phone": "0501234567",
  "amount": 4.60,
  "reference": "DH_1234567890",
  "bundle": {
    "id": 1,
    "name": "MTN Lite",
    "data": "1GB",
    "price": 4.60,
    "validity": "7 Days"
  }
}
```

### 2. Verify Payment
```
GET /api/verify-payment/DH_1234567890
```

### 3. Get All Transactions
```
GET /api/transactions
```

### 4. Get Transaction by ID
```
GET /api/transactions/64a5c3e2f1234567890abc12
```

### 5. Get Transactions by Phone
```
GET /api/transactions/phone/0501234567
```

### 6. Health Check
```
GET /api/health
```

## 🔌 Paystack Webhook Setup

1. Go to https://paystack.com/
2. Sign in to dashboard
3. Settings → API Keys & Webhooks
4. Under Webhooks, set URL to:
   ```
   https://yourdomain.com/api/webhooks/paystack
   ```
5. Select events: `charge.success`, `charge.failed`

## 🌐 Deployment Options

### Option 1: Heroku (Free)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create mtn-bundles

# Set environment variables
heroku config:set PAYSTACK_SECRET_KEY=sk_test_xxxxx
heroku config:set PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
heroku config:set FRONTEND_URL=https://yourdomain.com

# Deploy
git push heroku main
```

### Option 2: Render (Free - Recommended)
1. Go to https://render.com
2. Create account
3. New → Web Service
4. Connect GitHub repo
5. Configure environment variables
6. Deploy

### Option 3: Railway/Cyclic.sh
1. Go to https://railway.app or https://cyclic.sh
2. Sign in with GitHub
3. Create new project
4. Connect repository
5. Add environment variables
6. Deploy

### Option 4: Your Own Server (VPS)
```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone your-repo

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Start backend with PM2
cd backend
npm install
pm2 start server.js --name "mtn-backend"

# Setup monitoring
pm2 monit
```

## 📱 Frontend Integration

Update `js/payment.js` to send transactions to backend:

```javascript
async sendTransactionToBackend(transaction) {
    try {
        const response = await fetch('https://your-backend-url/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reference: transaction.reference,
                phone: transaction.customer.phone,
                amount: transaction.amount,
                bundle: transaction.bundle
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error sending to backend:', error);
    }
}
```

## 💰 Monitor Payments

Check dashboard at: `/api/transactions`

Example response:
```json
{
  "success": true,
  "stats": {
    "total": 25,
    "successful": 23,
    "pending": 2,
    "failed": 0,
    "totalRevenue": 234.50
  },
  "transactions": [...]
}
```

## 🔒 Security Notes

- Keep `.env` file private (add to .gitignore)
- Use HTTPS in production
- Validate all inputs on backend
- Use webhook secret for verification
- Set CORS properly for your domain

## 🆘 Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in .env
- Check firewall settings

**Paystack Verification Fails:**
- Verify SECRET_KEY is correct
- Check Paystack test vs live keys
- Ensure reference format matches

**Webhook Not Working:**
- Check backend URL is publicly accessible
- Verify webhook URL in Paystack dashboard
- Check firewall/port settings

## 📞 Support

For Paystack issues: https://support.paystack.com
For MongoDB help: https://docs.mongodb.com
For Node.js docs: https://nodejs.org/docs

---

**Your backend is now ready to receive live payments! 🎉**
