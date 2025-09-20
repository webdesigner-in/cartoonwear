import { NextResponse } from 'next/server';

export async function GET() {
  // Test email configuration without actually sending emails
  const config = {
    from: process.env.EMAIL_FROM || 'Not configured',
    host: process.env.EMAIL_SERVER_HOST || 'Not configured',
    port: process.env.EMAIL_SERVER_PORT || 'Not configured',
    user: process.env.EMAIL_SERVER_USER || 'Not configured',
    passwordConfigured: !!process.env.EMAIL_SERVER_PASSWORD,
  };
  
  // Check if all required environment variables are set
  const isConfigured = 
    process.env.EMAIL_FROM &&
    process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_PORT &&
    process.env.EMAIL_SERVER_USER &&
    process.env.EMAIL_SERVER_PASSWORD;
  
  return NextResponse.json({
    configured: isConfigured,
    configuration: config,
    message: isConfigured 
      ? '✅ Email configuration looks complete!' 
      : '❌ Email configuration is incomplete. Please check your .env.local file.',
    nextSteps: isConfigured 
      ? [
          'Test the forgot password functionality at /auth/reset-password',
          'Check your email inbox for reset messages'
        ]
      : [
          'Complete Gmail 2-Step Verification setup',
          'Generate App Password for Gmail',
          'Update EMAIL_SERVER_PASSWORD in .env.local',
          'Or use alternative email provider (Outlook, Yahoo, etc.)'
        ]
  });
}

export async function POST() {
  // Quick email test (for development only)
  try {
    const nodemailer = require('nodemailer');
    
    // Create a test SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
    
    // Verify connection
    await transporter.verify();
    
    return NextResponse.json({
      success: true,
      message: '✅ Email server connection successful!',
      details: 'SMTP configuration is working correctly.'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '❌ Email server connection failed',
      error: error.message,
      suggestions: [
        'Check your Gmail App Password is correct',
        'Ensure 2-Step Verification is enabled on Gmail',
        'Verify EMAIL_SERVER_USER matches your Gmail address',
        'Try regenerating your Gmail App Password'
      ]
    }, { status: 500 });
  }
}