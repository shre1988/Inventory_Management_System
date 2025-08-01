#!/bin/bash

echo "🚀 Inventory Management System Deployment Script"
echo "================================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

echo "✅ Git repository found"

# Check if backend files exist
if [ ! -f "backend/package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

# Check if frontend files exist
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

echo "✅ All required files found"

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "1. MongoDB Atlas Setup:"
echo "   - Create MongoDB Atlas account"
echo "   - Create a cluster"
echo "   - Configure database access"
echo "   - Configure network access (allow all IPs)"
echo "   - Get connection string"
echo ""
echo "2. Backend Deployment (Render):"
echo "   - Go to render.com"
echo "   - Create new web service"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'backend'"
echo "   - Set environment variables:"
echo "     NODE_ENV=production"
echo "     PORT=10000"
echo "     JWT_SECRET=your-secret-key"
echo "     MONGO_URI=your-mongodb-connection-string"
echo "     ALLOWED_ORIGINS=https://your-frontend-app.vercel.app"
echo ""
echo "3. Frontend Deployment (Vercel):"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set root directory to 'frontend'"
echo "   - Set environment variable:"
echo "     VITE_API_URL=https://your-backend-app.onrender.com"
echo ""
echo "4. Update CORS:"
echo "   - After getting Vercel URL, update ALLOWED_ORIGINS in Render"
echo "   - Redeploy backend"
echo ""

echo "🔗 Useful Links:"
echo "================="
echo "MongoDB Atlas: https://mongodb.com"
echo "Render: https://render.com"
echo "Vercel: https://vercel.com"
echo ""

echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Consider committing them before deployment:"
    echo "   git add ."
    echo "   git commit -m 'Update before deployment'"
    echo "   git push"
    echo ""
fi

echo "🎯 Next Steps:"
echo "==============="
echo "1. Follow the checklist above"
echo "2. Deploy backend on Render first"
echo "3. Deploy frontend on Vercel"
echo "4. Update CORS settings"
echo "5. Test your application"
echo ""

echo "✅ Deployment script completed!"
echo "Good luck with your deployment! 🚀" 