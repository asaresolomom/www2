#!/usr/bin/env node

# MTN UP2U Bundle Store - Setup & Run

## 🚀 Quick Start (3 Steps)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Or manually create .env with:
PAYSTACK_PUBLIC_KEY=pk_live_YOUR_KEY
PAYSTACK_SECRET_KEY=sk_live_YOUR_KEY
MONGODB_URI=mongodb://localhost:27017/mtn-bundles
PORT=3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Get keys from: https://paystack.com/settings/api-keys-webhooks

### Step 3: Start Server
```bash
npm run dev
```

✅ **DONE!** Open: http://localhost:3000

---

## 📋 What This Project Does

✅ Sell MTN UP2U data bundles (1GB-4GB)
✅ Accept payments via Paystack  
✅ Store transactions in MongoDB
✅ Admin dashboard to view all sales
✅ Real-time webhook updates
✅ Production-ready & deployable

---

## 🔧 Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Paystack JavaScript SDK
- Modern & minimal UI

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- Paystack API integration
- CORS-enabled

---

## 📁 Project Files

```
.
├── index.html              # Main UI
├── index.js                # Frontend logic
├── style.css               # Styling
├── js/
│   └── payment.js          # Paystack integration
├── backend/
│   ├── server.js           # API backend
│   ├── package.json        # Dependencies
│   ├── .env                # Config (not in git)
│   ├── .env.example        # Config template
│   └── README.md           # Backend docs
├── .gitignore              # Git ignore
└── README.md               # Main README
```

---

## 💳 Available Bundles

| Plan | Data | Price | Validity |
|------|------|-------|----------|
| Lite | 1GB | ₵4.60 | 1 day |
| Basic | 2GB | ₵8.50 | 3 days |
| Standard | 3GB | ₵13.50 | 7 days |
| Plus | 4GB | ₵23.50 | 14 days |

---

## 🌐 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/phone/:phone` | By customer phone |
| GET | `/api/verify-payment/:ref` | Verify payment |
| GET | `/api/health` | Health check |

---

## 🚀 Deploy to Production

### Option A: Render.com (Easiest)

1. Push to GitHub
2. Go to render.com
3. Connect repo → Deploy
4. Add `.env` variables
5. Set start command: `npm start`

**Your URL:** https://your-app.onrender.com

### Option B: Railway.app

1. Push to GitHub
2. Go to railway.app
3. Import project
4. Add environment variables
5. Deploy

### Option C: Heroku

```bash
heroku login
heroku create app-name
git push heroku main
heroku config:set PAYSTACK_SECRET_KEY=sk_...
```

---

## 🔒 Security Checklist

✅ `.env` is in `.gitignore` (never commit secrets)
✅ Paystack keys stored in environment variables
✅ CORS enabled for frontend communication
✅ MongoDB connection with credentials in .env
✅ Error handling implemented
✅ Production-ready logging

---

## 🧪 Test Locally

1. Run `npm run dev`
2. Open http://localhost:3000
3. Select bundle
4. Enter phone: `0501234567`
5. Click "Buy Now"
6. Complete Paystack payment
7. See success message ✅

---

## 📊 Admin Dashboard

View all transactions:
```
GET http://localhost:3000/api/transactions
```

**Returns:**
```json
{
  "success": true,
  "stats": {
    "total": 45,
    "success": 40,
    "pending": 3,
    "failed": 2,
    "totalRevenue": 250.50
  },
  "transactions": [...]
}
```

---

## 📞 Support

**Documentation:**
- [Backend Docs](./backend/README.md)
- [Deployment Guide](./backend/DEPLOYMENT_CHECKLIST.md)
- [Setup Guide](./backend/SETUP_GUIDE.md)

**External Resources:**
- Paystack: https://paystack.com/docs
- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com

---

## ⚠️ Important Notes

1. **Never commit `.env`** - Add to `.gitignore` ✓
2. **Generate Paystack keys** - Get from dashboard
3. **Setup MongoDB** - Local or Atlas (free)
4. **Test before deploy** - Use test keys first
5. **Configure webhook** - After deployment

---

## 🎯 Next Steps

1. ✅ Clone/Download project
2. ✅ Run `npm install` in backend/
3. ✅ Create `.env` with Paystack keys
4. ✅ Run `npm run dev`
5. ✅ Test at http://localhost:3000
6. ✅ Deploy to production
7. ✅ Configure Paystack webhook

---

**Status:** ✅ Production Ready

**Version:** 1.0.0

**License:** MIT

**Author:** Asare Solomon
