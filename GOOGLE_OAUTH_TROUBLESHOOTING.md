# 🔧 Google OAuth Troubleshooting Guide

## 🚨 Issue: Google Authentication Requests Blocked

### **Problem:**
- Google OAuth requests are being blocked repeatedly
- Cannot change email or complete Google sign-in process
- Users getting blocked/rejected during authentication

## ✅ **Fix Applied:**

### **1. Restored PrismaAdapter**
- **Issue**: Removing PrismaAdapter broke Google OAuth flow
- **Fix**: Restored `PrismaAdapter(prisma)` - required for OAuth providers
- **Reason**: NextAuth needs adapter for database operations with OAuth

### **2. Added Events Callback for Role Control**
```javascript
events: {
  async createUser({ user }) {
    // Fix role for new users created by PrismaAdapter
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        role: 'CUSTOMER',  // Ensure new users get CUSTOMER role
        isActive: true     // Ensure they're active
      }
    })
  }
}
```

### **3. Simplified Callbacks**
- **signIn**: Only checks if existing users are active
- **JWT**: Simple role assignment from user object
- **Session**: Standard token-to-session mapping

## 🔍 **If Google OAuth Still Blocked, Check:**

### **1. Google Console Configuration**
Visit [Google Cloud Console](https://console.cloud.google.com/):

#### **OAuth 2.0 Client IDs Settings:**
- **Authorized JavaScript origins**:
  ```
  https://www.thekroshetnani.com
  http://localhost:3000 (for development)
  ```

- **Authorized redirect URIs**:
  ```
  https://www.thekroshetnani.com/api/auth/callback/google
  http://localhost:3000/api/auth/callback/google (for development)
  ```

#### **OAuth Consent Screen:**
- **Publishing status**: Published (not "Testing")
- **User type**: External
- **Scopes**: email, profile, openid

### **2. Environment Variables**
Verify in production (Vercel):
```bash
GOOGLE_CLIENT_ID="530535712842-ohigcft7rfr3mlblabtu9c7fuqqif70m.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXTAUTH_URL="https://www.thekroshetnani.com"
NEXTAUTH_SECRET="[your-secret]"
```

### **3. Common Blocking Reasons:**

#### **Redirect URI Mismatch:**
- Error: `redirect_uri_mismatch`
- Fix: Ensure exact match in Google Console

#### **OAuth App Not Verified:**
- Error: "This app isn't verified"
- Fix: Either verify app or add test users

#### **Domain Verification:**
- Error: Domain not verified
- Fix: Verify domain in Google Console

#### **Too Many Requests:**
- Error: Rate limiting
- Fix: Wait and retry, check quota limits

### **4. Debug Steps:**

#### **A. Check Browser Network Tab:**
1. Open Developer Tools → Network
2. Try Google sign-in
3. Look for failed requests
4. Check response messages

#### **B. Check Server Logs:**
1. Look for NextAuth errors
2. Check Prisma connection issues
3. Verify database operations

#### **C. Test OAuth URL Directly:**
```
https://www.thekroshetnani.com/api/auth/signin/google
```

## 🧪 **Testing Current Fix:**

### **1. New User Flow:**
1. Go to: https://www.thekroshetnani.com/auth/signin
2. Click "Sign in with Google"
3. Complete Google OAuth
4. Should create user with `CUSTOMER` role

### **2. Existing User Flow:**
1. Try signing in with existing Google account
2. Should check if user is active
3. Should sign in successfully if active

### **3. Verify User Role:**
After successful login, user should have:
- `role: "CUSTOMER"`
- `isActive: true`
- `emailVerified: true`

## 📋 **Current Configuration:**

### **NextAuth Setup:**
- ✅ PrismaAdapter restored
- ✅ Google Provider configured
- ✅ Events callback for role fixing
- ✅ Proper redirect URLs
- ✅ Secure role assignment

### **Database Schema:**
- ✅ Default role: `CUSTOMER`
- ✅ User model with proper fields
- ✅ Role enum: `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`

## 🔧 **If Still Having Issues:**

### **Immediate Actions:**
1. Clear browser cookies/cache
2. Try incognito/private mode  
3. Check Google Console for errors
4. Verify redirect URIs exactly match

### **Advanced Debugging:**
1. Enable NextAuth debug mode (set `NEXTAUTH_DEBUG=true`)
2. Check production logs in Vercel
3. Test with different Google accounts
4. Verify Google OAuth app status

---

## 🎯 **Expected Result:**

Google OAuth should now work properly:
- ✅ No more blocked requests  
- ✅ Users can sign in with Google
- ✅ New users get `CUSTOMER` role
- ✅ Proper authentication flow

**If you're still experiencing issues, please share the specific error message or behavior you're seeing!**