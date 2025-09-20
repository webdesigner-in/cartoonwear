# 📧 Email Setup Guide for Password Reset

This guide will help you set up email functionality for the forgot password feature in your e-commerce application.

## 🌟 Quick Setup with Gmail (Recommended)

### Step 1: Gmail Account Setup

1. **Use your business Gmail account**: `thekroshetnani@gmail.com`
2. **Enable 2-Step Verification** (required for App Passwords):
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification"
   - Follow the setup process

### Step 2: Generate App Password

1. **Go to App Passwords**:
   - Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
   - You'll need to sign in again

2. **Create App Password**:
   - Select app: "Other (custom name)"
   - Name it: "The Kroshet Nani Website"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables

Open your `.env.local` file and update these values:

```env
# Email Configuration
EMAIL_FROM=thekroshetnani@gmail.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=thekroshetnani@gmail.com
EMAIL_SERVER_PASSWORD=your-16-character-app-password-here
```

**Replace `your-16-character-app-password-here` with your actual App Password.**

## 🔧 Alternative Email Providers

### Option 2: Outlook/Hotmail

```env
EMAIL_SERVER_HOST=smtp-mail.outlook.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@outlook.com
EMAIL_SERVER_PASSWORD=your-password
```

### Option 3: Yahoo Mail

```env
EMAIL_SERVER_HOST=smtp.mail.yahoo.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@yahoo.com
EMAIL_SERVER_PASSWORD=your-app-password
```

### Option 4: Custom SMTP Server

```env
EMAIL_SERVER_HOST=mail.yourdomain.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@yourdomain.com
EMAIL_SERVER_PASSWORD=your-password
```

## 🧪 Testing Email Configuration

### Method 1: Using the Application

1. Start your development server: `npm run dev`
2. Go to: `http://localhost:3000/auth/reset-password`
3. Enter your email address
4. Check if you receive the reset email

### Method 2: Using Test API

You can test the email configuration by creating a test endpoint:

1. Create `src/app/api/test-email/route.js`:

```javascript
import { testEmailConfiguration } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await testEmailConfiguration();
  return NextResponse.json(result);
}
```

2. Visit: `http://localhost:3000/api/test-email`

## 🔐 Security Best Practices

### Environment Variables

✅ **DO:**
- Store sensitive data in `.env.local`
- Use App Passwords for Gmail
- Keep your `.env.local` file in `.gitignore`

❌ **DON'T:**
- Commit email credentials to version control
- Use your main Gmail password
- Share App Passwords

### Email Security

✅ **Features Implemented:**
- Token expiration (1 hour)
- One-time use tokens
- Secure email templates
- Rate limiting protection
- No password exposure

## 🎨 Email Template Features

Your password reset emails include:

- **Beautiful HTML Design**: Matches your brand colors
- **Mobile Responsive**: Looks great on all devices
- **Security Information**: Clear expiration and usage notes
- **Professional Branding**: The Kroshet Nani styling
- **Fallback Text Version**: For email clients that don't support HTML

## 🚀 Going Live (Production)

### For Production Environment:

1. **Update Environment URLs**:
```env
NEXTAUTH_URL=https://yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
```

2. **Consider Professional Email Service**:
   - SendGrid
   - Mailgun
   - Amazon SES
   - Postmark

3. **DNS Configuration**:
   - Set up SPF records
   - Configure DKIM
   - Add DMARC policy

## ❗ Troubleshooting

### Common Issues:

**Email not sending?**
- Check App Password is correct (no spaces)
- Verify 2-Step Verification is enabled
- Ensure Gmail account is active

**"Invalid credentials" error?**
- Double-check EMAIL_SERVER_USER matches your Gmail
- Regenerate App Password if needed
- Check for typos in .env.local

**Emails going to spam?**
- Add sender to contact list
- Check spam folder
- Verify email content isn't triggering filters

**Rate limiting issues?**
- Gmail allows ~500 emails/day for free accounts
- Consider Gmail Workspace for higher limits
- Implement request throttling in production

## 🆘 Need Help?

If you encounter issues:

1. **Check the console logs** for detailed error messages
2. **Verify environment variables** are loaded correctly
3. **Test with a simple email first**
4. **Check your Gmail security settings**

## 📧 Sample Email Preview

Your users will receive beautiful emails like this:

```
🧶 The Kroshet Nani
Premium Handmade Crochet Collection

🔐 Password Reset Request

Hello there! We received a request to reset the password for your account.

[Reset My Password Button]

🛡️ Security Information
• This link will expire in 1 hour for your security
• If you didn't request this reset, please contact us immediately
• Never share this link with anyone

---
The Kroshet Nani
Delhi, India | thekroshetnani@gmail.com
```

## ✨ Ready to Test!

Once you've completed the setup:

1. Update your `.env.local` file
2. Restart your development server
3. Test the forgot password functionality
4. Check your email for the beautiful reset message!

Your password reset system is now fully functional with professional email delivery! 🎉