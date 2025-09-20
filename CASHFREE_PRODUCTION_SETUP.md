# 💳 Cashfree Production Setup Guide

## ⚠️ **IMPORTANT DISCLAIMER**
**Production environment handles REAL MONEY transactions. Please test thoroughly in sandbox first!**

## 🚀 **Step-by-Step Production Setup**

### **Step 1: Get Production Credentials from Cashfree**

1. **Login to Cashfree Dashboard**:
   - Go to: https://merchant.cashfree.com/
   - Login with your verified business account

2. **Switch to Production Mode**:
   - In the dashboard, toggle from "Test" to "Live/Production" mode
   - ⚠️ Make sure you're in PRODUCTION mode

3. **Get Your Production Credentials**:
   - Go to "Developers" → "API Keys"
   - Copy your **Production App ID** (starts with your merchant ID)
   - Copy your **Production Secret Key** (starts with `cfsk_ma_prod_`)

4. **Verify Your Business Details**:
   - Ensure KYC is completed
   - Bank account is verified
   - Business documents are approved

### **Step 2: Update Environment Variables**

**Option A: Create Production Environment File**

Create a new file `.env.production` for production-only settings:

```env
# Cashfree Production Configuration
CASHFREE_APP_ID=your-production-app-id-here
CASHFREE_SECRET_KEY=cfsk_ma_prod_your-production-secret-here
CASHFREE_ENVIRONMENT=production
CASHFREE_DEV_MODE=false

# Production App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com/
NEXTAUTH_URL=https://yourdomain.com
```

**Option B: Update .env.local (for testing)**

```env
# Cashfree Payment Gateway - PRODUCTION MODE
CASHFREE_APP_ID=your-production-app-id-here
CASHFREE_SECRET_KEY=cfsk_ma_prod_your-production-secret-here
CASHFREE_ENVIRONMENT=production
CASHFREE_DEV_MODE=false
```

### **Step 3: Verify Production Integration**

Run our test script to verify the configuration:

```bash
npm run test-payment-production
```

### **Step 4: Test with Small Amounts**

1. **Start with ₹1 transactions** to verify everything works
2. **Use your own payment methods** for initial testing
3. **Test all payment flows**:
   - Card payments
   - UPI payments  
   - Net banking
   - Wallet payments

### **Step 5: Webhook Configuration**

Update your webhook URL in Cashfree dashboard:

**Production Webhook URL**: `https://yourdomain.com/api/payment/webhook`

## 🔒 **Security Checklist**

### **Before Going Live:**

✅ **Environment Variables**:
- [ ] Production App ID configured
- [ ] Production Secret Key configured  
- [ ] CASHFREE_ENVIRONMENT=production
- [ ] CASHFREE_DEV_MODE=false

✅ **URLs Updated**:
- [ ] Return URL updated to production domain
- [ ] Cancel URL updated to production domain
- [ ] Webhook URL configured in Cashfree dashboard

✅ **Testing Complete**:
- [ ] Test payments with small amounts (₹1-₹10)
- [ ] Test payment success flow
- [ ] Test payment failure flow
- [ ] Test webhook processing
- [ ] Test refund process (if applicable)

✅ **Business Verification**:
- [ ] KYC completed with Cashfree
- [ ] Bank account verified
- [ ] Settlement details configured

## ⚡ **Quick Production Test Setup**

If you want to test RIGHT NOW with minimal changes:

1. **Get your production credentials** from Cashfree dashboard
2. **Update only these 4 variables** in your `.env.local`:

```env
CASHFREE_APP_ID=your-production-app-id
CASHFREE_SECRET_KEY=cfsk_ma_prod_your-secret
CASHFREE_ENVIRONMENT=production  
CASHFREE_DEV_MODE=false
```

3. **Restart your server**: `npm run dev`
4. **Test with ₹1 payment** to verify everything works

## 🚨 **SAFETY GUIDELINES**

### **DO's:**
✅ Test with small amounts (₹1-₹10) initially
✅ Use your own payment methods for testing
✅ Verify webhooks are working correctly
✅ Check transaction status in Cashfree dashboard
✅ Monitor settlement reports

### **DON'Ts:**
❌ Don't test with large amounts initially
❌ Don't go live without thorough testing
❌ Don't share production credentials
❌ Don't test with other people's money
❌ Don't skip webhook verification

## 📊 **Monitoring Production Transactions**

### **Cashfree Dashboard Monitoring:**
1. **Transaction Reports**: Check all payments in real-time
2. **Settlement Reports**: Monitor money transfers to your bank
3. **Failed Transactions**: Review and analyze failures
4. **Refund Tracking**: Monitor refund requests and processing

### **Application Monitoring:**
- Check your application logs for payment processing
- Monitor database for order status updates
- Verify email notifications are working
- Test customer order flow end-to-end

## 🔄 **Rollback Plan**

If something goes wrong, quickly rollback:

```env
# Immediate rollback to sandbox
CASHFREE_APP_ID=TEST108031120b3df80b6f9e24e70ccd21130801
CASHFREE_SECRET_KEY=cfsk_ma_test_ceb1ac6fd8a668c7ffda4dd36752ee29_2359facf
CASHFREE_ENVIRONMENT=sandbox
CASHFREE_DEV_MODE=true
```

## 💡 **Production Best Practices**

### **Transaction Amounts:**
- **Test Phase**: ₹1-₹10 transactions
- **Soft Launch**: ₹50-₹500 transactions
- **Full Launch**: All transaction amounts

### **Monitoring:**
- Set up alerts for failed payments
- Monitor transaction success rates
- Track settlement delays
- Monitor customer payment experience

### **Customer Support:**
- Have refund process ready
- Payment failure resolution process
- Customer query handling system
- Transaction dispute resolution

## 🆘 **Emergency Contacts**

- **Cashfree Support**: support@cashfree.com
- **Cashfree Phone**: +91-80-61606911
- **Integration Help**: developer@cashfree.com

## 🎯 **Next Steps After Setup**

1. **Test thoroughly** with small amounts
2. **Monitor transactions** closely for first 24-48 hours
3. **Gather customer feedback** on payment experience
4. **Optimize** based on success/failure rates
5. **Scale up** transaction volumes gradually

---

## ⭐ **Ready to Test Production?**

Follow the steps above, start with ₹1 test transactions, and gradually scale up once everything is working perfectly!

**Remember**: Production = Real Money. Test carefully! 💰