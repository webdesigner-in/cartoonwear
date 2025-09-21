import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
});

/**
 * Generate beautiful HTML email template for order confirmation
 */
function generateOrderConfirmationHTML(orderData) {
  const { 
    orderNumber, 
    customerName, 
    customerEmail, 
    items, 
    total, 
    shippingAddress,
    createdAt 
  } = orderData;

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #f0f0f0;">
        <div style="display: flex; align-items: center;">
          <div style="margin-left: 15px;">
            <h4 style="margin: 0; color: #333; font-size: 16px;">${item.productName || item.title}</h4>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
            <p style="margin: 0; color: #d4950b; font-weight: bold;">₹${item.price}</p>
          </div>
        </div>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - The Kroshet Nani</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fef7e7; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #d4950b 0%, #f59e0b 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                🧶 The Kroshet Nani
            </h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Handmade with Love ❤️
            </p>
        </div>

        <!-- Order Confirmation Section -->
        <div style="padding: 40px 30px; text-align: center; background-color: #f8fdf8; border-bottom: 3px solid #10b981;">
            <div style="background-color: #10b981; color: white; padding: 15px; border-radius: 50px; display: inline-block; margin-bottom: 20px;">
                <span style="font-size: 24px;">✅</span>
            </div>
            <h2 style="color: #059669; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h2>
            <p style="color: #333; margin: 0; font-size: 18px;">
                Thank you for your order, <strong>${customerName}!</strong>
            </p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px;">
            <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #d4950b; padding-bottom: 10px;">
                📦 Order Details
            </h3>
            
            <div style="background-color: #fef7e7; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <p style="margin: 8px 0; color: #333;"><strong>Order Number:</strong> #${orderNumber}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Order Date:</strong> ${new Date(createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Total Amount:</strong> <span style="color: #d4950b; font-weight: bold; font-size: 18px;">₹${total}</span></p>
            </div>

            <!-- Items -->
            <h4 style="color: #333; margin: 25px 0 15px 0; font-size: 18px;">🛍️ Your Items:</h4>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${itemsHTML}
            </table>

            <!-- Shipping Address -->
            ${shippingAddress ? `
            <h4 style="color: #333; margin: 25px 0 15px 0; font-size: 18px;">🚚 Shipping Address:</h4>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; border-left: 4px solid #d4950b;">
                <p style="margin: 5px 0; color: #333; line-height: 1.5;">
                    ${shippingAddress.fullName}<br>
                    ${shippingAddress.addressLine1}<br>
                    ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '<br>' : ''}
                    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
                    📞 ${shippingAddress.phone}
                </p>
            </div>
            ` : ''}
        </div>

        <!-- Delivery Timeline -->
        <div style="background-color: #dbeafe; padding: 30px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">🚛 Delivery Information</h3>
            <p style="color: #1e3a8a; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">
                Your handcrafted items are being prepared with care
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px dashed #60a5fa;">
                <p style="color: #1e40af; margin: 0; font-size: 18px; font-weight: bold;">
                    📅 Expected Delivery: 3-5 Business Days
                </p>
                <p style="color: #64748b; margin: 8px 0 0 0; font-size: 14px;">
                    We'll send you tracking details once your order ships!
                </p>
            </div>
        </div>

        <!-- Care Instructions -->
        <div style="padding: 30px; background-color: #fdf4ff;">
            <h3 style="color: #a855f7; margin: 0 0 15px 0; font-size: 18px;">🧶 Care Instructions</h3>
            <div style="background-color: white; padding: 20px; border-radius: 10px; border-left: 4px solid #a855f7;">
                <ul style="margin: 0; padding-left: 20px; color: #333;">
                    <li style="margin: 8px 0;">Hand wash gently in cold water</li>
                    <li style="margin: 8px 0;">Lay flat to dry away from direct sunlight</li>
                    <li style="margin: 8px 0;">Store in a clean, dry place</li>
                    <li style="margin: 8px 0;">Handle with love - it's handmade! ❤️</li>
                </ul>
            </div>
        </div>

        <!-- Contact Support -->
        <div style="padding: 30px; background-color: #f1f5f9; text-align: center;">
            <h3 style="color: #475569; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
            <p style="color: #64748b; margin: 0 0 15px 0;">
                We're here to help! Contact us if you have any questions about your order.
            </p>
            <div style="margin: 20px 0;">
                <a href="mailto:${process.env.EMAIL_FROM}" style="background-color: #d4950b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                    📧 Contact Support
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #374151; color: white; padding: 25px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
                🧶 The Kroshet Nani
            </p>
            <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">
                Creating beautiful handmade crochet items with love
            </p>
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                This email was sent to ${customerEmail} regarding order #${orderNumber}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} The Kroshet Nani. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(orderData) {
  try {
    const emailHTML = generateOrderConfirmationHTML(orderData);

    const mailOptions = {
      from: {
        name: '🧶 The Kroshet Nani',
        address: process.env.EMAIL_FROM
      },
      to: orderData.customerEmail,
      subject: `🎉 Order Confirmed #${orderData.orderNumber} - Thank you for your purchase!`,
      html: emailHTML,
      // Plain text version for email clients that don't support HTML
      text: `
Dear ${orderData.customerName},

Thank you for your order! Your order #${orderData.orderNumber} has been confirmed.

Order Details:
- Total: ₹${orderData.total}
- Items: ${orderData.items.length} item(s)
- Expected Delivery: 3-5 business days

We'll send you tracking details once your order ships.

Best regards,
The Kroshet Nani Team
🧶 Handmade with Love
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent successfully to ${orderData.customerEmail}`);
    console.log('Email ID:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration() {
  try {
    const result = await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return { success: false, error: error.message };
  }
}