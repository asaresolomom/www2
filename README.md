# 🚀 MTN UP2U Bundle Store

A complete, production-ready platform for selling MTN UP2U data bundles with live Paystack payments.

## ✨ Features

- 📱 **Modern & Minimal UI** - Clean, professional design
- 💳 **Paystack Integration** - Live payment processing
- 🗄️ **MongoDB Database** - Transaction storage & management
- 📊 **Admin Dashboard** - View all transactions & stats
- 🔔 **Real-time Webhooks** - Instant payment verification
- 🌐 **Full Stack** - Node.js backend + vanilla JavaScript frontend
- 📈 **Production Ready** - Deploy to Render, Railway, or Heroku

---

## 📁 Project Structure

```
mtn-bundles/
├── index.html              # Main application interface
├── index.js                # Bundle logic & form handling
├── style.css               # Modern minimal styling
├── js/
│   └── payment.js          # Paystack payment module
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Dependencies
│   ├── .env                # Configuration (not in git)
│   ├── .env.example        # Template for .env
│   └── README.md           # Backend documentation
├── .gitignore              # Git ignore file
└── README.md               # This file
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/mtn-bundles.git
cd mtn-bundles/backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```bash
PAYSTACK_PUBLIC_KEY=pk_live_YOUR_KEY
PAYSTACK_SECRET_KEY=sk_live_YOUR_KEY
MONGODB_URI=mongodb://localhost:27017/mtn-bundles
PORT=3000
FRONTEND_URL=http://localhost:3000
```

Get Paystack keys: https://paystack.com/settings/api-keys-webhooks

### 3. Setup Database (Optional)

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mtn-bundles
```

### 4. Start Server

```bash
npm run dev          # Development with auto-reload
npm start            # Production
```

Open: **http://localhost:3000**

---

## 📊 Available Bundles

| Bundle | Data | Price | Validity |
|--------|------|-------|----------|
| Lite | 1GB | ₵4.60 | 1 day |
| Basic | 2GB | ₵8.50 | 3 days |
| Standard | 3GB | ₵13.50 | 7 days |
| Plus | 4GB | ₵23.50 | 14 days |

---

## 🔌 API Endpoints

### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "reference": "ref_abc123",
  "phone": "0501234567",
  "amount": 8.50,
  "bundle": {
    "id": 2,
    "name": "MTN Basic",
    "data": "2GB",
    "price": 8.50
  }
}
```

### Get All Transactions
```http
GET /api/transactions
```

### Get by Phone
```http
GET /api/transactions/phone/0501234567
```

### Verify Payment
```http
GET /api/verify-payment/ref_abc123
```

### Health Check
```http
GET /api/health
```

---

## 🚀 Deployment

### Deploy to Render (Free)

1. Push code to GitHub
2. Go to **render.com**
3. New Web Service → Connect GitHub repo
4. **Build:** `npm install`
5. **Start:** `node backend/server.js`
6. Add environment variables in Render dashboard
7. Deploy! 🎉

### Deploy to Railway

1. Push code to GitHub
2. Go to **railway.app**
3. New Project → Deploy from GitHub
4. Select repo and add environment variables
5. Deploy

### Deploy to Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set PAYSTACK_SECRET_KEY=sk_...
```

---

## 🔧 Configure Paystack Webhook

1. Go to https://paystack.com/settings/developers
2. Add webhook URL:
   - **Production:** `https://your-domain.com/api/webhooks/paystack`
   - **Local:** `http://YOUR_IP:3000/api/webhooks/paystack`
3. Select event: `charge.complete`
4. Save

---

## 🗄️ Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Payments:** Paystack API
- **Hosting:** Render, Railway, Heroku

---

## 📚 Documentation

- [Backend Documentation](./backend/README.md) - API & setup
- [Setup Guide](./backend/SETUP_GUIDE.md) - Detailed setup
- [Deployment Guide](./backend/DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment
- [Quick Start](./backend/QUICK_START.md) - 3-minute setup

---

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ CORS enabled for frontend communication
- ✅ Paystack webhook verification
- ✅ MongoDB connection pooling
- ✅ Error handling & logging

---

## 📝 Environment Variables

**Required in `.env`:**
- `PAYSTACK_PUBLIC_KEY` - Paystack public key
- `PAYSTACK_SECRET_KEY` - Paystack secret key (keep private!)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - development | production

---

## 🧪 Testing

### Test Payment (Local)

1. Start backend: `npm run dev`
2. Open http://localhost:3000
3. Select bundle → Enter phone → Click "Buy Now"
4. Complete Paystack test payment
5. See success message
6. Check: http://localhost:3000/api/transactions

### Test API Endpoints

```bash
# Create transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "test_ref_001",
    "phone": "0501234567",
    "amount": 8.50,
    "bundle": {"id": 2, "name": "MTN Basic", "data": "2GB", "price": 8.50}
  }'

# Get all transactions
curl http://localhost:3000/api/transactions

# Health check
curl http://localhost:3000/api/health
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port in use** | Change PORT in .env or kill process |
| **MongoDB error** | Check connection string & IP whitelist |
| **Paystack denied** | Verify SECRET_KEY is correct |
| **CORS error** | Check FRONTEND_URL in .env |
| **Webhook failing** | Webhook URL must be public (not localhost) |

---

## 📈 Performance

- Lightweight frontend (no frameworks)
- Optimized database queries with indexes
- Caching for bundle data
- Async/await for non-blocking operations

---

## 🔄 Git Workflow

```bash
# Clone
git clone <repo-url>

# Create branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "Add feature"

# Push
git push origin feature/your-feature

# Create Pull Request
```

---

## ⚠️ Important Notes

1. **Never commit `.env`** - Add to `.gitignore` (already done)
2. **Keep Paystack keys private** - Use environment variables
3. **Test locally first** - Before pushing to production
4. **Monitor logs** - Check backend console for errors
5. **Update webhook** - After deploying to new domain

---

## 📞 Support

For issues:
1. Check [Paystack Docs](https://paystack.com/docs)
2. Check [MongoDB Docs](https://docs.mongodb.com)
3. Review server logs
4. Test with curl commands

---

## 📄 License

MIT License - Free to use and modify

---

## 👤 Author

Asare Solomon  
MTN UP2U Distributor  
Ghana 🇬🇭

---

**Ready to deploy?** Follow the [Deployment Guide](./backend/DEPLOYMENT_CHECKLIST.md) for step-by-step instructions. 🚀
