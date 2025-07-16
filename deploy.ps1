# Grade Calculator - GitHub Pages Deployment Script (PowerShell)

Write-Host "🚀 Starting deployment to GitHub Pages..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if gh-pages is installed
$ghPagesInstalled = npm list gh-pages 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Installing gh-pages..." -ForegroundColor Yellow
    npm install --save-dev gh-pages
}

# Build the application
Write-Host "🔨 Building the application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

# Deploy to GitHub Pages
Write-Host "📤 Deploying to GitHub Pages..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your application should be available at: https://your-username.github.io/grade-calculator" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to your repository on GitHub"
    Write-Host "2. Navigate to Settings > Pages"
    Write-Host "3. Set Source to 'Deploy from a branch'"
    Write-Host "4. Select 'gh-pages' branch"
    Write-Host "5. Save the settings"
    Write-Host ""
    Write-Host "⏳ It may take a few minutes for the changes to appear." -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
    exit 1
} 