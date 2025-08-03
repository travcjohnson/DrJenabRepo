# Firebase Authentication Fix Guide

## 🚨 Current Issue
Authentication is failing on production deployments with error: `auth/unauthorized-domain`

## ✅ Quick Fix Steps

### 1. Access Firebase Console
1. Go to https://console.firebase.google.com
2. Sign in with your Google account
3. Select the **jenabapp** project

### 2. Add Authorized Domains
1. Click **Authentication** in the left sidebar
2. Go to **Settings** tab at the top
3. Scroll to **Authorized domains** section
4. Click **Add domain** button
5. Add these domains:
   ```
   dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app
   travcjohnson.github.io
   ```
6. Click **Add** for each domain
7. Save changes

### 3. Verify Fix
1. Visit https://dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app
2. Click "Sign In"
3. Complete Google OAuth
4. Should now redirect to chat successfully

## 🔍 Understanding the Error

### Console Errors Explained:
- **`auth/unauthorized-domain`**: Firebase blocks OAuth from unrecognized domains for security
- **CORS errors**: Expected when checking localhost ports (can be ignored)
- **Will-change memory**: Performance warning about particle animations (not critical)

### Why This Happens:
Firebase requires explicit domain authorization to prevent:
- Phishing attacks
- Unauthorized OAuth redirects
- Cross-site request forgery

## 📋 Domain Checklist

Add these domains to Firebase authorized list:

- [ ] `dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app` (Vercel production)
- [ ] `travcjohnson.github.io` (GitHub Pages)
- [ ] `localhost` (already authorized for development)
- [ ] Any custom domains you add later

## 🎯 After Fix Verification

Once domains are added:

1. **Test Sign In Flow**:
   - Visit production URL
   - Click "Sign In"
   - Complete Google OAuth
   - Verify redirect to chat.html
   - Check chat bubble appears in header

2. **Test Sign Out Flow**:
   - Click "Sign Out" on chat page
   - Verify redirect to homepage
   - Confirm chat bubble disappears

3. **Test Both Deployments**:
   - Vercel: https://dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app
   - GitHub Pages: https://travcjohnson.github.io/DrJenabRepo

## 🔧 Alternative: Development Mode

If you can't access Firebase Console immediately, use the localStorage fallback:

1. Open browser console
2. Run: `clearAuth()` (clears any cached auth state)
3. The sign-in will use localStorage fallback automatically
4. This allows testing other features while Firebase is being configured

## 📝 Prevention for Future Deployments

Before deploying to new domains:
1. Add domain to Firebase authorized list FIRST
2. Test authentication locally
3. Deploy to production
4. Verify authentication works

---

**Note**: This is a one-time configuration. Once domains are added to Firebase, authentication will work permanently.