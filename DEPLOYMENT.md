# Quick Deployment Guide

## 🚀 Deploy to GitHub Pages (Quick Steps)

### 1. Create GitHub Repository

Go to https://github.com/new and create a repository named `levels-of-reality`

### 2. Push Your Code

```bash
# Navigate to project
cd /Users/norapetrova/Projects/experiments/physics/levels-of-reality/levels-of-reality

# Add all changes
git add .

# Commit
git commit -m "Complete refactoring and enhancement - 16 levels with new visualizations"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/levels-of-reality.git

# Push
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to `https://github.com/YOUR_USERNAME/levels-of-reality/settings/pages`
2. Under **Source**, select **"GitHub Actions"**
3. Save

### 4. Watch Deployment

- Go to the **Actions** tab in your repo
- Watch the "Deploy to GitHub Pages" workflow run
- Once complete (green checkmark), your site is live!

### 5. Access Your Site

```
https://YOUR_USERNAME.github.io/levels-of-reality/
```

---

## 🔄 Future Updates

After the initial deployment, any time you push to `main`:

```bash
git add .
git commit -m "Your update message"
git push
```

GitHub Actions will automatically rebuild and redeploy!

---

## 🛠️ Troubleshooting

### Build Fails
- Check the Actions tab for error logs
- Make sure all dependencies are in package.json
- Verify vite.config.js has the correct base path

### Page Shows 404
- Confirm GitHub Pages source is set to "GitHub Actions"
- Check that the workflow completed successfully
- Wait a few minutes for DNS propagation

### Styling Issues
- Make sure `base: '/levels-of-reality/'` is in vite.config.js
- Rebuild: `npm run build` locally to test

---

## 📊 What Gets Deployed

The GitHub Actions workflow:
1. Checks out your code
2. Installs dependencies with `npm ci`
3. Builds production bundle with `npm run build`
4. Deploys the `dist/` folder to GitHub Pages
5. Makes it available at your GitHub Pages URL

Total deployment time: ~2-3 minutes per push.
