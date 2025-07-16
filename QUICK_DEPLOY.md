# Quick Deployment Checklist

## Before Deploying

- [ ] Update `homepage` in `package.json` with your GitHub username
- [ ] Ensure all changes are committed to git
- [ ] Test the build locally: `npm run build`

## Deployment Options

### Option 1: Manual Deployment (Recommended for first time)
```bash
npm run build
npm run deploy
```

### Option 2: Using Scripts
**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
./deploy.sh
```

### Option 3: Automatic Deployment (GitHub Actions)
- Push to main/master branch
- GitHub Actions will automatically deploy

## After Deployment

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: "gh-pages"
5. Save

## Your App URL
```
https://your-username.github.io/grade-calculator
```

## Troubleshooting

- **Build fails**: Check for syntax errors
- **Deploy fails**: Check GitHub credentials
- **404 on refresh**: Normal with HashRouter
- **API not working**: Update backend URL in production

## Need Help?
- Check `DEPLOYMENT.md` for detailed instructions
- Check browser console for errors
- Create an issue in the repository 