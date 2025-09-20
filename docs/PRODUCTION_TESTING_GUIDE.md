# 🚀 Production Testing Guide for The Kroshet Nani

This guide helps you safely test your Cashfree production integration with real payments.

## ⚠️ IMPORTANT SAFETY WARNINGS

**🔥 PRODUCTION ENVIRONMENT = REAL MONEY TRANSACTIONS 🔥**

- All transactions in production mode involve **REAL MONEY**
- Start with very small amounts (₹1-₹5)
- Have a clear testing plan and budget
- Monitor your bank account and Cashfree dashboard closely
- Keep detailed records of all test transactions

---

## 📋 Pre-Production Checklist

Before testing in production, ensure:

- [ ] ✅ KYC verification completed in Cashfree dashboard
- [ ] ✅ Business documents approved
- [ ] ✅ Bank account verified for settlements
- [ ] ✅ Webhook URLs configured correctly
- [ ] ✅ SSL certificate installed on your domain
- [ ] ✅ Production credentials obtained from Cashfree
- [ ] ✅ Environment variables updated
- [ ] ✅ Test plan documented

---

## 🔧 Step 1: Configure Production Environment

### 1.1 Update Environment Variables

Update your `.env.local` file:

```env
# Cashfree Production Settings
CASHFREE_APP_ID=your_production_app_id_here
CASHFREE_SECRET_KEY=cfsk_ma_prod_your_production_secret_key_here
CASHFREE_ENVIRONMENT=production
CASHFREE_DEV_MODE=false

# Your domain for webhooks
NEXTAUTH_URL=https://yourdomain.com
```

### 1.2 Restart Your Application

After updating environment variables:

```bash
# Stop your development server (Ctrl+C)
# Then restart
npm run dev
```

---

## 🧪 Step 2: Verify Configuration

### 2.1 Check Configuration Status

Visit: `http://localhost:3000/api/test-payment-production`

This will show you:
- Current environment configuration
- Production readiness status  
- Any missing or incorrect settings
- Next steps to complete setup

Expected response when ready:
```json
{
  "status": "READY_FOR_PRODUCTION",
  "message": "✅ Cashfree Production configuration looks complete!",
  "productionChecks": {
    "environment": true,
    "devModeDisabled": true,
    "productionSecretKey": true,
    "appIdConfigured": true,
    "allConfigured": true
  }
}
```

---

## 💸 Step 3: Test Small Payment

### 3.1 Create Test Order (₹1)

**⚠️ WARNING: This creates a REAL ₹1 transaction!**

Make a POST request to test endpoint:

```bash
curl -X POST http://localhost:3000/api/test-payment-production
```

This will:
- Create a ₹1 test order
- Return payment session details
- Show order ID for tracking

### 3.2 Expected Success Response

```json
{
  "status": "SUCCESS",
  "message": "🎉 Production payment session created successfully!",
  "testOrder": {
    "orderId": "TEST_PROD_1704123456789",
    "amount": 1.00,
    "currency": "INR",
    "status": "ACTIVE"
  },
  "paymentSessionId": "session_xyz123...",
  "warning": "⚠️ This is a REAL ₹1 transaction in production mode!"
}
```

---

## 🔍 Step 4: Monitor and Verify

### 4.1 Check Cashfree Dashboard

1. Login to [Cashfree Merchant Dashboard](https://merchant.cashfree.com/)
2. Navigate to **Transactions** → **Orders**
3. Find your test order ID
4. Verify order details and status

### 4.2 Track Payment Flow

Monitor these key points:

1. **Order Creation** ✅
   - Order appears in dashboard
   - Status shows "ACTIVE" or "CREATED"

2. **Payment Processing** 
   - Customer completes payment
   - Status changes to "PAID"

3. **Webhook Processing**
   - Your webhook endpoint receives notification
   - Order status updated in your database

4. **Settlement**
   - Money appears in your bank account
   - Usually T+1 or T+2 business days

---

## 📊 Step 5: Full Integration Testing

### 5.1 Test Complete Purchase Flow

1. **Add items to cart**
2. **Proceed to checkout** 
3. **Complete payment with ₹1-₹5**
4. **Verify order confirmation**
5. **Check email notifications**
6. **Confirm database updates**

### 5.2 Test Error Scenarios

Test these failure cases:
- Failed payments
- Cancelled transactions  
- Timeout scenarios
- Invalid customer details
- Network failures

---

## 📈 Step 6: Gradual Scaling

### 6.1 Progressive Amount Testing

Once ₹1 tests work perfectly:

1. **₹1-₹5**: Basic functionality
2. **₹10-₹50**: Small orders  
3. **₹100-₹500**: Medium orders
4. **₹1000+**: Larger transactions

### 6.2 Volume Testing

Test with:
- Multiple simultaneous orders
- Different payment methods
- Various customer profiles
- Peak load scenarios

---

## 🚨 Troubleshooting Common Issues

### Issue: "Configuration Incomplete"

**Solution:**
- Check all environment variables are set correctly
- Verify production secret key format
- Ensure CASHFREE_ENVIRONMENT=production
- Restart your application

### Issue: "KYC Pending" Error

**Solution:**
- Complete KYC verification in Cashfree dashboard
- Submit all required business documents
- Wait for approval (can take 1-3 business days)

### Issue: Webhook Not Received

**Solution:**
- Verify webhook URL in Cashfree dashboard
- Ensure your domain has valid SSL certificate
- Test webhook endpoint manually
- Check firewall/security settings

### Issue: Settlement Not Received

**Solution:**
- Check settlement schedule (T+1, T+2, etc.)
- Verify bank account details
- Contact Cashfree support if delayed

---

## 📞 Support and Resources

### Cashfree Support
- **Email**: support@cashfree.com
- **Phone**: +91-8080-808-727
- **Dashboard**: [merchant.cashfree.com](https://merchant.cashfree.com/)

### Documentation
- [Cashfree API Docs](https://docs.cashfree.com/reference)
- [Webhook Guide](https://docs.cashfree.com/docs/webhooks)
- [Payment Gateway Integration](https://docs.cashfree.com/docs/payment-gateway)

---

## ✅ Production Go-Live Checklist

Before going fully live:

- [ ] All test scenarios passed successfully
- [ ] Webhooks working correctly
- [ ] Email notifications configured
- [ ] Error handling tested
- [ ] Settlement process verified
- [ ] Customer support processes ready
- [ ] Monitoring and alerting setup
- [ ] Backup and recovery plan tested
- [ ] Legal compliance verified
- [ ] Security audit completed

---

## 🔄 Rollback Plan

If issues arise in production:

1. **Immediate Actions**:
   - Switch back to sandbox mode
   - Update CASHFREE_ENVIRONMENT=sandbox
   - Restart application
   - Disable payment processing temporarily

2. **Investigation**:
   - Check error logs
   - Review Cashfree dashboard
   - Analyze failed transactions
   - Contact Cashfree support if needed

3. **Resolution**:
   - Fix identified issues
   - Test fixes in sandbox
   - Re-test in production with small amounts
   - Gradually restore full functionality

---

**Remember: Production testing should be methodical, well-documented, and carefully monitored. Start small and scale gradually!**