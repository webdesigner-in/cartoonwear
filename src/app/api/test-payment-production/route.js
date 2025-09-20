import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const config = {
      appId: process.env.CASHFREE_APP_ID || 'Not configured',
      environment: process.env.CASHFREE_ENVIRONMENT || 'Not configured',
      devMode: process.env.CASHFREE_DEV_MODE || 'Not configured',
      secretKeyConfigured: !!process.env.CASHFREE_SECRET_KEY,
      secretKeyPrefix: process.env.CASHFREE_SECRET_KEY?.substring(0, 20) + '...' || 'Not configured'
    };

    // Check if we're in production mode
    const isProduction = process.env.CASHFREE_ENVIRONMENT === 'production';
    const devModeOff = process.env.CASHFREE_DEV_MODE === 'false';
    const hasProductionSecret = process.env.CASHFREE_SECRET_KEY?.startsWith('cfsk_ma_prod_');

    // Production readiness checks
    const productionChecks = {
      environment: isProduction,
      devModeDisabled: devModeOff,
      productionSecretKey: hasProductionSecret,
      appIdConfigured: !!process.env.CASHFREE_APP_ID,
      allConfigured: isProduction && devModeOff && hasProductionSecret && !!process.env.CASHFREE_APP_ID
    };

    // Get API base URL
    const apiBaseUrl = isProduction 
      ? 'https://api.cashfree.com' 
      : 'https://sandbox.cashfree.com';

    return NextResponse.json({
      status: productionChecks.allConfigured ? 'READY_FOR_PRODUCTION' : 'CONFIGURATION_INCOMPLETE',
      message: productionChecks.allConfigured 
        ? '✅ Cashfree Production configuration looks complete!'
        : '⚠️ Some production settings are missing or incorrect.',
      
      configuration: config,
      productionChecks,
      apiBaseUrl,
      
      warnings: [
        !isProduction && '❌ CASHFREE_ENVIRONMENT should be "production"',
        !devModeOff && '❌ CASHFREE_DEV_MODE should be "false"',
        !hasProductionSecret && '❌ CASHFREE_SECRET_KEY should start with "cfsk_ma_prod_"',
        !process.env.CASHFREE_APP_ID && '❌ CASHFREE_APP_ID is missing'
      ].filter(Boolean),
      
      nextSteps: productionChecks.allConfigured ? [
        '1. Test with ₹1 payment to verify everything works',
        '2. Check Cashfree dashboard for transaction records',
        '3. Verify webhook processing',
        '4. Test payment success and failure flows',
        '5. Gradually increase test amounts'
      ] : [
        '1. Login to Cashfree merchant dashboard',
        '2. Switch to Production mode',
        '3. Get your Production App ID and Secret Key',
        '4. Update your .env.local with production credentials',
        '5. Set CASHFREE_ENVIRONMENT=production',
        '6. Set CASHFREE_DEV_MODE=false',
        '7. Restart your development server'
      ],
      
      safetyReminders: [
        '⚠️ Production environment handles REAL MONEY',
        '💰 Start testing with small amounts (₹1-₹10)',
        '🔒 Never share your production credentials',
        '📊 Monitor transactions in Cashfree dashboard',
        '🔄 Have a rollback plan ready'
      ]
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Failed to check production configuration',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // This would test creating a minimal payment session
    // FOR PRODUCTION TESTING ONLY - handles real money!
    
    if (process.env.CASHFREE_ENVIRONMENT !== 'production') {
      return NextResponse.json({
        error: 'This endpoint only works in production mode',
        currentEnvironment: process.env.CASHFREE_ENVIRONMENT,
        message: 'Switch to production mode first'
      }, { status: 400 });
    }

    // Create a ₹1 test order
    const orderData = {
      order_amount: 1.00, // ₹1 for testing
      order_currency: 'INR',
      order_id: `TEST_PROD_${Date.now()}`,
      customer_details: {
        customer_id: 'test_customer_prod',
        customer_name: 'Production Test',
        customer_email: 'test@thekroshetnani.com',
        customer_phone: '+919999999999'
      },
      order_meta: {
        return_url: process.env.NEXTAUTH_URL + '/payment/success?orderId={order_id}',
        notify_url: process.env.NEXTAUTH_URL + '/api/payment/webhook'
      }
    };

    const response = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        status: 'SUCCESS',
        message: '🎉 Production payment session created successfully!',
        testOrder: {
          orderId: result.order_id,
          amount: result.order_amount,
          currency: result.order_currency,
          status: result.order_status
        },
        paymentSessionId: result.payment_session_id,
        warning: '⚠️ This is a REAL ₹1 transaction in production mode!',
        nextSteps: [
          'Check your Cashfree dashboard for this test order',
          'You can complete this ₹1 payment to fully test the flow',
          'Monitor your bank account for settlement'
        ]
      });
    } else {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Failed to create production payment session',
        error: result,
        possibleIssues: [
          'Check if your production credentials are correct',
          'Verify KYC status in Cashfree dashboard',
          'Ensure your account is approved for live transactions',
          'Check if all required business documents are submitted'
        ]
      }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Production test failed',
      error: error.message,
      suggestion: 'Check your production credentials and network connection'
    }, { status: 500 });
  }
}