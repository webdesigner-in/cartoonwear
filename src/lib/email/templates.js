// Email templates for order notifications

export const getOrderConfirmationTemplate = (order, paymentStatus = 'PAID') => {
  const isPaid = paymentStatus === 'PAID';
  const isOnline = order.paymentMethod && order.paymentMethod !== 'cod';
  
  return {
    subject: isPaid ? 
      `Order Confirmed - Your Kroshet Nani Order #${order.id.slice(-8)}` : 
      `Order Received - Payment Pending #${order.id.slice(-8)}`,
    
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order ${isPaid ? 'Confirmed' : 'Received'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background-color: #D4AF37; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .order-details { background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .status-paid { background-color: #dcfce7; color: #166534; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-failed { background-color: #fee2e2; color: #991b1b; }
          .item { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧶 The Kroshet Nani</h1>
            <h2>${isPaid ? 'Order Confirmed!' : 'Order Received'}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${order.user.name || 'Valued Customer'},</p>
            
            ${isPaid ? `
              <p>Great news! Your order has been confirmed and payment has been successfully processed.</p>
            ` : `
              <p>We've received your order! ${paymentStatus === 'PENDING' ? 'Your payment is currently being processed.' : 'There was an issue with your payment.'}</p>
            `}
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id.slice(-8)}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Payment Status:</strong> 
                <span class="status-badge ${
                  paymentStatus === 'PAID' ? 'status-paid' : 
                  paymentStatus === 'FAILED' ? 'status-failed' : 'status-pending'
                }">
                  ${paymentStatus}
                </span>
              </p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              
              <h4>Items Ordered:</h4>
              ${order.items.map(item => `
                <div class="item">
                  <div>
                    <strong>${item.product.name}</strong><br>
                    <small>Quantity: ${item.quantity}</small>
                  </div>
                  <div>₹${item.price}</div>
                </div>
              `).join('')}
              
              <div class="item" style="border-top: 2px solid #D4AF37; font-weight: bold;">
                <div>Total Amount</div>
                <div>₹${order.totalAmount}</div>
              </div>
            </div>
            
            <div class="order-details">
              <h4>Shipping Address:</h4>
              <p>
                ${order.address.firstName} ${order.address.lastName}<br>
                ${order.address.address1}<br>
                ${order.address.address2 ? order.address.address2 + '<br>' : ''}
                ${order.address.city}, ${order.address.state} ${order.address.zipCode}<br>
                ${order.address.country}<br>
                Phone: ${order.address.phone}
              </p>
            </div>
            
            ${isPaid ? `
              <p>Your order will be processed and shipped within 2-3 business days. You'll receive a tracking number once your order is shipped.</p>
            ` : paymentStatus === 'PENDING' ? `
              <p>We'll notify you once your payment is confirmed. Your order will then be processed and shipped.</p>
            ` : `
              <p>Please contact us or try placing your order again. If you need assistance, we're here to help!</p>
            `}
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">
                View Order Details
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing The Kroshet Nani!</p>
            <p>Need help? Contact us at thekroshetnani@gmail.com</p>
            <p>🧶 Handcrafted with love | The Kroshet Nani</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    text: `
      Order ${isPaid ? 'Confirmed' : 'Received'} - The Kroshet Nani
      
      Dear ${order.user.name || 'Valued Customer'},
      
      ${isPaid ? 
        'Great news! Your order has been confirmed and payment has been successfully processed.' :
        `We've received your order! ${paymentStatus === 'PENDING' ? 'Your payment is currently being processed.' : 'There was an issue with your payment.'}`
      }
      
      Order Details:
      - Order ID: #${order.id.slice(-8)}
      - Order Date: ${new Date(order.createdAt).toLocaleDateString()}
      - Payment Status: ${paymentStatus}
      - Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
      
      Items Ordered:
      ${order.items.map(item => `- ${item.product.name} (Qty: ${item.quantity}) - ₹${item.price}`).join('\n')}
      
      Total Amount: ₹${order.totalAmount}
      
      Shipping Address:
      ${order.address.firstName} ${order.address.lastName}
      ${order.address.address1}
      ${order.address.address2 ? order.address.address2 + '\n' : ''}${order.address.city}, ${order.address.state} ${order.address.zipCode}
      ${order.address.country}
      Phone: ${order.address.phone}
      
      ${isPaid ? 
        'Your order will be processed and shipped within 2-3 business days.' :
        paymentStatus === 'PENDING' ? 
          "We'll notify you once your payment is confirmed." :
          'Please contact us or try placing your order again.'
      }
      
      View your order: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}
      
      Thank you for choosing The Kroshet Nani!
      Contact us: thekroshetnani@gmail.com
    `
  };
};

export const getPaymentStatusUpdateTemplate = (order, oldStatus, newStatus) => {
  const isPaid = newStatus === 'PAID';
  const wasPending = oldStatus === 'PENDING';
  
  return {
    subject: isPaid ? 
      `Payment Confirmed - Order #${order.id.slice(-8)}` : 
      `Payment Status Updated - Order #${order.id.slice(-8)}`,
    
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background-color: ${isPaid ? '#16a34a' : '#D4AF37'}; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .status-update { background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 10px; }
          .status-paid { background-color: #dcfce7; color: #166534; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-failed { background-color: #fee2e2; color: #991b1b; }
          .status-refunded { background-color: #fed7aa; color: #9a3412; }
          .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧶 The Kroshet Nani</h1>
            <h2>${isPaid ? '✅ Payment Confirmed!' : '📋 Payment Status Updated'}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${order.user.name || 'Valued Customer'},</p>
            
            ${isPaid && wasPending ? `
              <p>Excellent news! Your payment has been successfully confirmed for order #${order.id.slice(-8)}.</p>
              <p>Your order is now being processed and will be shipped within 2-3 business days.</p>
            ` : isPaid ? `
              <p>Your payment status has been updated to confirmed for order #${order.id.slice(-8)}.</p>
            ` : `
              <p>We wanted to update you on the payment status for your order #${order.id.slice(-8)}.</p>
            `}
            
            <div class="status-update">
              <h3>Payment Status Update</h3>
              <div>
                <span class="status-badge ${
                  oldStatus === 'PAID' ? 'status-paid' : 
                  oldStatus === 'FAILED' ? 'status-failed' : 
                  oldStatus === 'REFUNDED' ? 'status-refunded' : 'status-pending'
                }">${oldStatus}</span>
                →
                <span class="status-badge ${
                  newStatus === 'PAID' ? 'status-paid' : 
                  newStatus === 'FAILED' ? 'status-failed' : 
                  newStatus === 'REFUNDED' ? 'status-refunded' : 'status-pending'
                }">${newStatus}</span>
              </div>
              <p><strong>Order ID:</strong> #${order.id.slice(-8)}</p>
              <p><strong>Order Total:</strong> ₹${order.totalAmount}</p>
            </div>
            
            ${newStatus === 'PAID' ? `
              <p>🎉 Great! Your payment is now confirmed and your order will be processed shortly.</p>
            ` : newStatus === 'FAILED' ? `
              <p>Unfortunately, there was an issue with your payment. Please contact us or try placing your order again.</p>
            ` : newStatus === 'REFUNDED' ? `
              <p>Your payment has been refunded. The refund should appear in your account within 5-7 business days.</p>
            ` : `
              <p>Your payment is currently being processed. We'll notify you once it's confirmed.</p>
            `}
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">
                View Order Details
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing The Kroshet Nani!</p>
            <p>Need help? Contact us at thekroshetnani@gmail.com</p>
            <p>🧶 Handcrafted with love | The Kroshet Nani</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    text: `
      Payment Status Update - The Kroshet Nani
      
      Dear ${order.user.name || 'Valued Customer'},
      
      ${isPaid && wasPending ? 
        'Excellent news! Your payment has been successfully confirmed.' :
        'We wanted to update you on your payment status.'
      }
      
      Order ID: #${order.id.slice(-8)}
      Payment Status: ${oldStatus} → ${newStatus}
      Order Total: ₹${order.totalAmount}
      
      ${newStatus === 'PAID' ? 
        'Your payment is now confirmed and your order will be processed shortly.' :
        newStatus === 'FAILED' ? 
          'Unfortunately, there was an issue with your payment. Please contact us.' :
          newStatus === 'REFUNDED' ? 
            'Your payment has been refunded. The refund should appear in your account within 5-7 business days.' :
            'Your payment is currently being processed.'
      }
      
      View your order: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}
      
      Thank you for choosing The Kroshet Nani!
      Contact us: thekroshetnani@gmail.com
    `
  };
};