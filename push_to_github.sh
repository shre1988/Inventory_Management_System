#!/bin/bash

echo "🚀 Pushing Inventory Management System to GitHub..."
echo "Repository: https://github.com/shre1988/Inventory_Management_System"
echo ""

# Set up Git configuration
git config --global user.name "shre1988"
git config --global user.email "shretalekar90@gmail.com"

# Add all files
echo "📁 Adding files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Initial commit: Inventory Management System with deployment configuration"

# Try different push methods
echo "📤 Pushing to GitHub..."

# Method 1: Try with credential helper
git config --global credential.helper store

# Method 2: Try push with timeout
timeout 30 git push origin main

if [ $? -eq 124 ]; then
    echo "⏰ Push timed out. Trying alternative method..."
    
    # Method 3: Try with different remote URL
    git remote set-url origin https://shre1988@github.com/shre1988/Inventory_Management_System.git
    timeout 30 git push origin main
fi

echo ""
echo "✅ If push was successful, check: https://github.com/shre1988/Inventory_Management_System"
echo ""
echo "🔧 If push failed, try these alternatives:"
echo "1. Use GitHub Desktop: https://desktop.github.com/"
echo "2. Use GitHub Web Interface: https://github.com/shre1988/Inventory_Management_System"
echo "3. Create Personal Access Token: https://github.com/settings/tokens"
echo ""
echo "📖 For manual upload:"
echo "- Go to https://github.com/shre1988/Inventory_Management_System"
echo "- Click 'uploading an existing file'"
echo "- Drag and drop your project folder"
echo "- Add commit message and push" 