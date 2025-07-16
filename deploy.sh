#!/bin/bash

# Grade Calculator - GitHub Pages Deployment Script

echo "🚀 Starting deployment to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to GitHub Pages
echo "📤 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your application should be available at: https://your-username.github.io/grade-calculator"
    echo ""
    echo "📝 Next steps:"
    echo "1. Go to your repository on GitHub"
    echo "2. Navigate to Settings > Pages"
    echo "3. Set Source to 'Deploy from a branch'"
    echo "4. Select 'gh-pages' branch"
    echo "5. Save the settings"
    echo ""
    echo "⏳ It may take a few minutes for the changes to appear."
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi 