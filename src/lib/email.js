import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/confirm?token=${resetToken}`;
  
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: 'The Kroshet Nani',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: '🔒 Password Reset Request - The Kroshet Nani',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - The Kroshet Nani</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
              background: rgba(255,255,255,0.1);
              text-align: center;
              padding: 40px 20px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: white;
              margin-bottom: 10px;
            }
            .tagline {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
            }
            .content {
              background: white;
              padding: 40px 30px;
              text-align: center;
            }
            .icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #F59E0B, #D97706);
              border-radius: 50%;
              margin: 0 auto 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            }
            h1 {
              color: #1f2937;
              font-size: 28px;
              margin-bottom: 20px;
            }
            p {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #F59E0B, #D97706);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
              transition: all 0.3s ease;
            }
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 30px rgba(245, 158, 11, 0.4);
            }
            .security-note {
              background: #fef3c7;
              border-left: 4px solid #F59E0B;
              padding: 20px;
              margin: 30px 0;
              border-radius: 8px;
              text-align: left;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              color: #9ca3af;
              font-size: 14px;
              margin: 5px 0;
            }
            .social-links {
              margin-top: 20px;
            }
            .social-links a {
              color: #F59E0B;
              text-decoration: none;
              margin: 0 10px;
              font-weight: 500;
            }
            @media (max-width: 600px) {
              .container {
                margin: 20px;
                border-radius: 15px;
              }
              .content {
                padding: 30px 20px;
              }
              h1 {
                font-size: 24px;
              }
              .reset-button {
                padding: 14px 28px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🧶 The Kroshet Nani</div>
              <div class="tagline">Premium Handmade Crochet Collection</div>
            </div>
            
            <div class="content">
              <div class="icon">🔐</div>
              <h1>Password Reset Request</h1>
              <p>Hello there! We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
              
              <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              
              <div class="security-note">
                <h3 style="color: #92400e; margin-top: 0;">🛡️ Security Information</h3>
                <p style="margin: 0; color: #92400e;">
                  • This link will expire in <strong>1 hour</strong> for your security<br>
                  • If you didn't request this reset, please contact us immediately<br>
                  • Never share this link with anyone
                </p>
              </div>
              
              <p style="font-size: 14px; color: #9ca3af;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #F59E0B; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>The Kroshet Nani</strong></p>
              <p>Creating beautiful handmade crochet items with love and care</p>
              <p>Delhi, India | thekroshetnani@gmail.com</p>
              <div class="social-links">
                <a href="#">Instagram</a> | 
                <a href="#">Facebook</a> | 
                <a href="#">WhatsApp</a>
              </div>
              <p style="margin-top: 20px; font-size: 12px;">
                © ${new Date().getFullYear()} The Kroshet Nani. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request - The Kroshet Nani
      
      Hello! We received a request to reset the password for your account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for your security.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The Kroshet Nani Team
      
      ---
      The Kroshet Nani
      Delhi, India
      thekroshetnani@gmail.com
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
};