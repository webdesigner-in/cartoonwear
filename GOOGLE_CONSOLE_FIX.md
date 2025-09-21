# 🔧 Google Cloud Console Configuration Fix

## 🚨 **Your Issue:**
- No email selection option appears
- Getting blocked error repeatedly  
- OAuth authentication failing

## ✅ **Step-by-Step Fix:**

### **Step 1: Access Google Cloud Console**
1. Go to: https://console.cloud.google.com/
2. Select your project (the one with your OAuth credentials)
3. Navigate to: **APIs & Services** → **Credentials**

### **Step 2: Configure OAuth 2.0 Client ID**

Find your OAuth 2.0 Client ID and click **Edit** ✏️

#### **A. Authorized JavaScript Origins**
Add these **exact URLs**:
```
https://www.thekroshetnani.com
```

❌ **DO NOT ADD:**
- `http://` versions for production
- URLs with trailing slashes
- `www` if your domain doesn't use it

#### **B. Authorized Redirect URIs**
Add this **exact URL**:
```
https://www.thekroshetnani.com/api/auth/callback/google
```

⚠️ **CRITICAL:** The URL must be **exactly** as shown above!

### **Step 3: OAuth Consent Screen Configuration**

1. Go to: **APIs & Services** → **OAuth consent screen**

#### **A. User Type**
- Select: **External** (unless you're using Google Workspace)

#### **B. Publishing Status**
- **Current Status**: Likely "Testing" ❌
- **Required Status**: "In production" ✅

**To Publish:**
1. Click **PUBLISH APP** button
2. Confirm you want to make it public
3. Status should change to "In production"

#### **C. Test Users (if still in Testing)**
If you can't publish yet, add yourself as a test user:
1. Scroll to **Test users** section
2. Click **ADD USERS**
3. Add your email addresses that you want to test with

### **Step 4: OAuth Scopes**
Ensure these scopes are added:
- `email`
- `profile` 
- `openid`

### **Step 5: App Information**
Complete these **required fields**:
- **App name**: "The Kroshet Nani"
- **User support email**: Your email
- **App logo**: Upload a logo (recommended)
- **App domain**: `thekroshetnani.com`
- **Privacy policy URL**: `https://www.thekroshetnani.com/privacy`
- **Terms of service URL**: `https://www.thekroshetnani.com/terms`

## 🔄 **After Making Changes:**

### **Important Notes:**
1. **No waiting period** - Changes are immediate
2. **Clear browser cache** after changes
3. **Test in incognito mode** first

### **Testing Steps:**
1. Clear all cookies for your site
2. Open incognito/private browsing
3. Go to: https://www.thekroshetnani.com/auth/signin  
4. Click "Sign in with Google"
5. Should now show email selection screen

## 🚨 **Common Configuration Mistakes:**

### **❌ Wrong Redirect URI:**
```
❌ https://www.thekroshetnani.com/api/auth/callback/google/
❌ https://thekroshetnani.com/api/auth/callback/google
❌ http://www.thekroshetnani.com/api/auth/callback/google
```

### **✅ Correct Redirect URI:**
```
✅ https://www.thekroshetnani.com/api/auth/callback/google
```

### **❌ Wrong JavaScript Origin:**
```
❌ https://www.thekroshetnani.com/
❌ https://thekroshetnani.com
❌ http://www.thekroshetnani.com
```

### **✅ Correct JavaScript Origin:**
```
✅ https://www.thekroshetnani.com
```

## 🔍 **Debugging Tips:**

### **Check Developer Console:**
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Try Google sign-in
4. Look for failed requests (red status codes)
5. Check error messages in responses

### **Common Error Messages:**
- `redirect_uri_mismatch` → Fix redirect URI
- `invalid_client` → Check client ID/secret
- `access_blocked` → App not published/verified
- `unauthorized_client` → Check authorized origins

## 📋 **Quick Checklist:**

- [ ] OAuth 2.0 Client ID configured
- [ ] Correct redirect URI: `https://www.thekroshetnani.com/api/auth/callback/google`
- [ ] Correct JS origin: `https://www.thekroshetnani.com`
- [ ] OAuth consent screen published (not testing)
- [ ] Required scopes added (email, profile, openid)
- [ ] App information completed
- [ ] Browser cache cleared

## 🎯 **Expected Result:**

After fixing the configuration:
1. ✅ Google sign-in button works
2. ✅ Shows email account selection
3. ✅ Completes authentication successfully
4. ✅ Creates user with CUSTOMER role

---

## 🆘 **If Still Not Working:**

1. **Double-check** all URLs are exactly as specified
2. **Wait 5 minutes** after making changes
3. **Clear all site data** in browser
4. **Try different browser/incognito mode**
5. **Check Google Console for error logs**

**The most common issue is incorrect redirect URI configuration!** Make sure it matches exactly.

Let me know which step you get stuck on and I'll help further! 🔧