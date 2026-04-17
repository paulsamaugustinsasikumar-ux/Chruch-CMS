# Deploy Church Management System to Netlify

## 🚀 QUICK DEPLOYMENT GUIDE

### Step 1: Prepare Your Code
Make sure you have the latest fixes and all files ready.

### Step 2: Deploy Backend First (Railway Recommended)

#### Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Connect your GitHub repository
5. Select the `backend` folder
6. Set environment variables:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_mysql_database
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRES_IN=24h
   ```
7. Deploy - you'll get a URL like: `https://your-app.railway.app`

### Step 3: Deploy Frontend to Netlify

#### Method A: GitHub Integration (Recommended)
1. Go to https://netlify.com
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
6. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.com
   ```
7. Click "Deploy site"

#### Method B: Manual Upload
1. Build the frontend locally:
   ```bash
   cd frontend
   npm run build
   ```
2. Go to https://netlify.com
3. Drag and drop the `build` folder to deploy
4. Add environment variable in site settings

### Step 4: Update Backend CORS (Important!)
In your backend `server.js`, update CORS settings:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-netlify-site.netlify.app', 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true
};
```

### Step 5: Test Your Deployed App
1. Frontend: https://your-netlify-site.netlify.app
2. Backend: https://your-railway-app.railway.app/api/health
3. Login with: HJChosur / HJC@007

## 📋 DETAILED INSTRUCTIONS

### Backend Deployment Options:

#### Option 1: Railway (Recommended)
- ✅ Free tier available
- ✅ Built-in database support
- ✅ Easy deployment
- ✅ Good performance

#### Option 2: Render
- ✅ Free tier
- ✅ PostgreSQL support
- ✅ Simple deployment

#### Option 3: Heroku
- ✅ Reliable hosting
- ✅ Add-on databases
- ⚠️ Paid plans for MySQL

### Frontend Deployment (Netlify):
- ✅ Free hosting
- ✅ Fast deployment
- ✅ Custom domains
- ✅ Form handling
- ✅ Automatic HTTPS

### Environment Variables Needed:

**Frontend (.env):**
```
REACT_APP_API_URL=https://your-backend-url.com
```

**Backend:**
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

### Troubleshooting:

1. **404 on refresh:** The `_redirects` file handles this
2. **API not working:** Check REACT_APP_API_URL
3. **CORS errors:** Update backend CORS settings
4. **Build failing:** Check build logs in Netlify

### Custom Domain (Optional):
1. Go to Netlify site settings
2. Add custom domain
3. Configure DNS records
4. Update backend CORS with custom domain

## 🎉 SUCCESS CHECKLIST

- ✅ Frontend deployed to Netlify
- ✅ Backend deployed to Railway/Render
- ✅ Environment variables set
- ✅ CORS configured
- ✅ Database connected
- ✅ Login working
- ✅ All features functional

Your Church Management System is now live! 🚀