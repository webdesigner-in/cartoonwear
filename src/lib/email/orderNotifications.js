import nodemailer from 'nodemailer';
import { getOrderConfirmationTemplate, getPaymentStatusUpdateTemplate } from './templates.js';

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, paymentStatus = null) => {
  try {
    // Use the payment status from the order if not provided
    const finalPaymentStatus = paymentStatus || order.paymentStatus || 'PENDING';
    
    const transporter = createTransporter();
    const template = getOrderConfirmationTemplate(order, finalPaymentStatus);
    
    const mailOptions = {
      from: {
        name: 'The Kroshet Nani',
        address: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER
      },
      to: order.user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    console.log(`📧 Sending order confirmation email to ${order.user.email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send payment status update email
export const sendPaymentStatusUpdateEmail = async (order, oldStatus, newStatus) => {
  try {
    const transporter = createTransporter();
    const template = getPaymentStatusUpdateTemplate(order, oldStatus, newStatus);
    
    const mailOptions = {
      from: {
        name: 'The Kroshet Nani',
        address: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER
      },
      to: order.user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    console.log(`📧 Sending payment status update email to ${order.user.email} (${oldStatus} → ${newStatus})...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment status update email sent: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending payment status update email:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update email (for shipping updates)
export const sendOrderStatusUpdateEmail = async (order, oldStatus, newStatus) => {
  try {
    // Only send email for important status changes
    const importantStatusChanges = [
      'CONFIRMED',
      'SHIPPED', 
      'DELIVERED',
      'CANCELLED'
    ];
    
    if (!importantStatusChanges.includes(newStatus)) {
      return { success: true, skipped: true, reason: 'Not an important status change' };
    }
    
    const transporter = createTransporter();
    
    // Create a simple status update email
    const getStatusMessage = (status) => {
      switch (status) {
        case 'CONFIRMED': return 'Your order has been confirmed and is being prepared for shipment.';
        case 'SHIPPED': return 'Great news! Your order has been shipped and is on its way to you.';
        case 'DELIVERED': return 'Your order has been delivered. We hope you love your new items!';
        case 'CANCELLED': return 'Your order has been cancelled. If you have any questions, please contact us.';
        default: return `Your order status has been updated to ${status}.`;
      }
    };
    
    const subject = `Order Update - ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()} #${order.id.slice(-8)}`;
    const message = getStatusMessage(newStatus);
    
    const mailOptions = {
      from: {
        name: 'The Kroshet Nani',
        address: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER
      },
      to: order.user.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: #D4AF37; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧶 The Kroshet Nani</h1>
              <h2>Order Status Update</h2>
            </div>
            <div class="content">
              <p>Dear ${order.user.name || 'Valued Customer'},</p>
              <p>${message}</p>
              <p><strong>Order ID:</strong> #${order.id.slice(-8)}</p>
              <p><strong>Status:</strong> ${newStatus}</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">
                  View Order Details
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for choosing The Kroshet Nani!</p>
              <p>Need help? Contact us at thekroshetnani@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Status Update - The Kroshet Nani
        
        Dear ${order.user.name || 'Valued Customer'},
        
        ${message}
        
        Order ID: #${order.id.slice(-8)}
        Status: ${newStatus}
        
        View your order: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}
        
        Thank you for choosing The Kroshet Nani!
        Contact us: thekroshetnani@gmail.com
      `
    };

    console.log(`📧 Sending order status update email to ${order.user.email} (${oldStatus} → ${newStatus})...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order status update email sent: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return { success: false, error: error.message };
  }
};