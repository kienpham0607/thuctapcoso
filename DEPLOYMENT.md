# GitHub Pages Deployment Guide

## Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Repository**: Your project should be pushed to a GitHub repository
3. **Node.js**: Make sure you have Node.js installed (v14 or higher)

## Step-by-Step Deployment

### 1. Update Homepage URL

First, update the `homepage` field in `package.json` with your actual GitHub username:

```json
{
  "homepage": "https://your-actual-username.github.io/grade-calculator"
}
```

Replace `your-actual-username` with your real GitHub username.

### 2. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 3. Build the Application

Build the production version of your app:

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### 4. Deploy to GitHub Pages

Run the deployment command:

```bash
npm run deploy
```

This command will:
- Create a `gh-pages` branch
- Push the contents of the `build` folder to that branch
- Configure the branch for GitHub Pages

### 5. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Choose **gh-pages** branch
6. Click **Save**

### 6. Access Your Application

Your application will be available at:
```
https://your-username.github.io/grade-calculator
```

**Note**: It may take a few minutes for the changes to appear.

## Troubleshooting

### Common Issues

1. **404 Error on Refresh**
   - This is normal with React Router on GitHub Pages
   - The app uses HashRouter to handle this
   - URLs will look like: `https://your-username.github.io/grade-calculator/#/about`

2. **Build Fails**
   - Check for syntax errors in your code
   - Make sure all dependencies are installed
   - Run `npm run build` locally to test

3. **Deployment Fails**
   - Check your GitHub credentials
   - Make sure you have write access to the repository
   - Verify the repository name matches the homepage URL

4. **API Calls Don't Work**
   - Update the `proxy` field in `package.json` to point to your production backend
   - Or update API base URLs in your code to point to your deployed backend

### Manual Deployment

If the automatic deployment doesn't work, you can deploy manually:

1. Build the app: `npm run build`
2. Create a new branch: `git checkout -b gh-pages`
3. Remove all files except `build` folder contents
4. Move all files from `build` to root
5. Commit and push: 
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## Environment Variables

For production deployment, you may need to set environment variables:

1. **Frontend**: Create a `.env.production` file:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

2. **Backend**: Deploy your backend separately (Heroku, Vercel, etc.)

## Continuous Deployment

To set up automatic deployment on every push:

1. Go to your repository Settings
2. Navigate to Actions > General
3. Enable "Allow all actions and reusable workflows"
4. Create a GitHub Actions workflow file (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    - run: npm install
    - run: npm run build
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data like API keys
2. **API Security**: Ensure your backend has proper CORS configuration
3. **HTTPS**: GitHub Pages automatically provides HTTPS

## Performance Optimization

1. **Code Splitting**: The app already uses React.lazy() for code splitting
2. **Image Optimization**: Use optimized images and consider WebP format
3. **Bundle Size**: Monitor bundle size with `npm run build` output

## Support

If you encounter issues:

1. Check the GitHub Pages documentation
2. Review the deployment logs
3. Create an issue in the repository
4. Check the browser console for errors

## Useful Commands

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Run deployment script (if available)
./deploy.sh

# Check build size
npm run build && du -sh build/

# Test production build locally
npx serve -s build
``` 