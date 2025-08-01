# 🚀 Deployment Guide - Inventory Management System

This guide will help you deploy your Inventory Management System on Vercel (Frontend) and Render (Backend).

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MongoDB Atlas Account** - Sign up at [mongodb.com](https://mongodb.com)

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster:**
   - Go to [mongodb.com](https://mongodb.com)
   - Create a free account
   - Create a new cluster (M0 Free tier)
   - Choose your preferred region

2. **Configure Database Access:**
   - Go to "Database Access"
   - Create a new database user
   - Set username and password (save these!)
   - Set privileges to "Read and write to any database"

3. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Render deployment)

4. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend
1. Ensure your backend folder has these files:
   - `package.json` ✅
   - `index.js` ✅
   - `env.example` ✅
   - All model files ✅

### Step 2: Deploy on Render
1. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com)
   - Sign in with your GitHub account

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your project

3. **Configure Service:**
   - **Name:** `inventory-backend` (or your preferred name)
   - **Root Directory:** `backend` (if your backend is in a subfolder)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Set Environment Variables:**
   - Click "Environment" tab
   - Add these variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/inventory?retryWrites=true&w=majority
   ALLOWED_ORIGINS=https://your-frontend-app.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://inventory-backend.onrender.com`)

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Ensure your frontend folder has these files:
   - `package.json` ✅
   - `vite.config.js` ✅
   - `vercel.json` ✅
   - All React components ✅

### Step 2: Deploy on Vercel
1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (if your frontend is in a subfolder)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Set Environment Variables:**
   - Go to "Environment Variables"
   - Add this variable:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```
   - Replace with your actual Render backend URL

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://inventory-frontend.vercel.app`)

## 🔄 Update Backend CORS

After getting your Vercel frontend URL, update your Render backend:

1. **Go to Render Dashboard:**
   - Find your backend service
   - Go to "Environment" tab

2. **Update ALLOWED_ORIGINS:**
   - Change the value to your Vercel frontend URL
   - Example: `https://inventory-frontend.vercel.app`

3. **Redeploy:**
   - Go to "Manual Deploy" → "Deploy latest commit"

## 🧪 Testing Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com/api/test`
   - Should show: "Backend Working"

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try to register/login
   - Test inventory operations

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure `ALLOWED_ORIGINS` in Render includes your Vercel URL
   - Check that the URL is exactly correct (no trailing slash)

2. **Database Connection Issues:**
   - Verify MongoDB Atlas network access allows all IPs
   - Check that the connection string is correct
   - Ensure database user has proper permissions

3. **Build Errors:**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **Environment Variables:**
   - Double-check all environment variables are set correctly
   - Ensure no typos in variable names

### Debug Steps:

1. **Check Render Logs:**
   - Go to your Render service → "Logs"
   - Look for error messages

2. **Check Vercel Logs:**
   - Go to your Vercel project → "Functions" → "View Function Logs"

3. **Test API Endpoints:**
   - Use Postman or curl to test backend endpoints directly
   - Example: `curl https://your-backend.onrender.com/api/test`

## 🔐 Security Considerations

1. **JWT Secret:**
   - Use a strong, random JWT secret
   - Never commit secrets to Git

2. **MongoDB Security:**
   - Use strong database passwords
   - Consider IP whitelisting for production

3. **Environment Variables:**
   - Keep all secrets in environment variables
   - Never expose them in client-side code

## 📊 Monitoring

1. **Render Monitoring:**
   - Check "Metrics" tab for performance
   - Monitor "Logs" for errors

2. **Vercel Analytics:**
   - Enable Vercel Analytics for frontend monitoring
   - Check "Functions" for API performance

## 🚀 Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed on Render with all environment variables
- [ ] Frontend deployed on Vercel with correct API URL
- [ ] CORS configured properly
- [ ] All endpoints tested
- [ ] User registration/login working
- [ ] Inventory operations working
- [ ] Error handling implemented
- [ ] Security measures in place

## 📞 Support

If you encounter issues:

1. Check the logs in both Render and Vercel
2. Verify all environment variables are set correctly
3. Test API endpoints directly
4. Ensure database connection is working

Your Inventory Management System should now be live and accessible from anywhere! 🎉 