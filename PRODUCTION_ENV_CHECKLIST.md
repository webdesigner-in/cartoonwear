# 🔧 Production Environment Variables Checklist

## Current Local Environment Variables (.env.local)
```bash
# ✅ Cashfree Payment Configuration
CASHFREE_APP_ID="10780793b84ff87bd798dd653679708701"
CASHFREE_SECRET_KEY="cfsk_ma_prod_17d97f40dfc6f848a2198abcaf179aa9_7412e87a"
CASHFREE_ENVIRONMENT="production"
CASHFREE_DEV_MODE="false"
NEXT_PUBLIC_CASHFREE_ENVIRONMENT="production"

# ✅ Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_MLy5vo9dBGKq@ep-sparkling-rice-adme2j93-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# ✅ NextAuth Configuration
NEXTAUTH_SECRET="Bd9gDOnyRzMNvEMM13IPl8kAxz6IbuIeM/8NkOceUxoivlV9Ooakmy3M4S4="
NEXTAUTH_URL="https://www.thekroshetnani.com"

# ✅ OAuth Providers
GOOGLE_CLIENT_ID="530535712842-ohigcft7rfr3mlblabtu9c7fuqqif70m.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"

# ✅ Email Configuration
EMAIL_FROM="thekroshetnani@gmail.com"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_USER="thekroshetnani@gmail.com"
EMAIL_SERVER_PASSWORD="ubmv qpig cxrb crtn"
EMAIL_SERVER_PORT="587"

# ✅ App Configuration
NEXT_PUBLIC_APP_URL="https://www.thekroshetnani.com/"

# ✅ Stack Auth (Optional)
NEXT_PUBLIC_STACK_PROJECT_ID="aeb311ca-9873-454c-8b28-7a4221c79c2b"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="pck_6d0jp6bb4rvxhxrcp4pqv8vxb30pst7k9vhm2n1m57m18"
STACK_SECRET_SERVER_KEY="ssk_y93sfkd8x49kqdpvqgekgrjz3fqhv7gm1g9nctaqyv5cg"
```

## ⚠️ MISSING Environment Variables

Based on your code, you need to add these **missing variables** to production:

### GitHub OAuth (Currently Missing)
```bash
# ❌ Required for GitHub login (used in NextAuth)
GITHUB_ID="your_github_client_id_here"
GITHUB_SECRET="your_github_client_secret_here"
```

## 🚀 How to Add Missing Variables to Vercel Production

### Option 1: Using Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: `the-kroshet-nani`
3. Go to **Settings** → **Environment Variables**
4. Add the missing variables:

```bash
GITHUB_ID = your_github_client_id_here
GITHUB_SECRET = your_github_client_secret_here
```

### Option 2: Using Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Add environment variables
vercel env add GITHUB_ID production
vercel env add GITHUB_SECRET production
```

## 🔍 Critical Variables Verification

### ✅ Essential for Cashfree Payment (All Present)
- `CASHFREE_APP_ID` ✅
- `CASHFREE_SECRET_KEY` ✅
- `CASHFREE_ENVIRONMENT` ✅
- `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` ✅ ***(Newly Added)***

### ✅ Essential for Database (Present)
- `DATABASE_URL` ✅

### ✅ Essential for Authentication (Present)
- `NEXTAUTH_SECRET` ✅
- `NEXTAUTH_URL` ✅

### ✅ Essential for Email (Present)
- `EMAIL_SERVER_HOST` ✅
- `EMAIL_SERVER_USER` ✅
- `EMAIL_SERVER_PASSWORD` ✅
- `EMAIL_SERVER_PORT` ✅
- `EMAIL_FROM` ✅

### ⚠️ OAuth Providers Status
- `GOOGLE_CLIENT_ID` ✅
- `GOOGLE_CLIENT_SECRET` ✅
- `GITHUB_ID` ❌ **MISSING**
- `GITHUB_SECRET` ❌ **MISSING**

## 📋 Action Items

1. **Immediate**: Add missing GitHub OAuth credentials to production
2. **Verify**: All existing variables are properly set in Vercel dashboard
3. **Test**: GitHub login functionality after adding the variables

## 🔒 Security Notes

- Never commit `.env.local` to git (already in `.gitignore`)
- Regularly rotate API keys and secrets
- Use environment-specific values (production vs development)

## ✅ After Adding Missing Variables

Your production deployment will have full functionality:
- ✅ Cashfree payments working
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Email notifications
- ✅ Database connectivity
- ✅ All app features functional

---

**Next Step**: Add the missing `GITHUB_ID` and `GITHUB_SECRET` to your Vercel production environment!