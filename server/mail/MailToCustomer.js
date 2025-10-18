import { sendMail, getBaseTemplate } from "./mail.js";

export const orderConfirmation = async (order) => {
    // Process items with proper attribute handling
    const itemsHtml = order.items.map(item => {
        // Handle attributes properly (convert Map/Object to readable format)
        let attributesText = '';
        if (item.attributes) {
            if (item.attributes instanceof Map) {
                // If attributes is a Map
                const attrs = Array.from(item.attributes.entries())
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                attributesText = attrs;
            } else if (typeof item.attributes === 'object') {
                // If attributes is a regular object
                const attrs = Object.entries(item.attributes)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                attributesText = attrs;
            }
        }

        return `
            <tr>
                <td style="padding:12px; border-bottom:1px solid #f1f3f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                            <td style="width:80px;">
                                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;object-fit:cover;border-radius:4px;border:1px solid #e9ecef;">` : ''}
                            </td>
                            <td style="padding-left:16px; vertical-align:top;">
                                <div style="font-weight:500;color:#1a1a1a;font-size:16px;">${item.name}</div>
                                ${attributesText ? `<div style="font-size:14px;color:#6c757d;margin-top:4px;">${attributesText}</div>` : ''}
                                <div style="margin-top:8px;font-size:14px;color:#6c757d;">Qty: ${item.quantity} • LKR ${item.price.toFixed(2)}</div>
                            </td>
                            <td style="text-align:right; vertical-align:top;">
                                <div style="font-weight:500;color:#1a1a1a;font-size:16px;">LKR ${item.totalPrice.toFixed(2)}</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        `;
    }).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial, sans-serif;background-color:#f8f9fa;color:#1a1a1a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;padding:20px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                        <tr>
                            <td style="padding:40px;text-align:center;background:linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);">
                                <div style="font-size:28px;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;">${process.env.BRAND_NAME || 'World Store'}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px;">
                                <p style="font-size:18px;font-weight:400;margin-bottom:24px;">Dear ${order.shippingAddress.firstName} ${order.shippingAddress.lastName},</p>
                                <p style="margin-bottom:32px;font-size:14px;">Thank you for your order. We've received your purchase and are preparing it with the utmost care.</p>

                                <h3 style="font-size:16px;font-weight:500;text-transform:uppercase;margin-bottom:12px;">Order Details</h3>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
                                    <tr style="background-color:#f8f9fa;">
                                        <td style="padding:16px;border-bottom:1px solid #e9ecef;">
                                            Order #${order.orderNumber}<br>
                                            <span style="font-size:12px;color:#6c757d;">Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </td>
                                    </tr>
                                    ${itemsHtml}
                                </table>

                                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#f8f9fa;padding:16px;border-radius:6px;">
                                    <tr>
                                        <td style="font-size:14px;color:#6c757d;">Subtotal</td>
                                        <td style="font-size:14px;color:#1a1a1a;text-align:right;">LKR ${order.subtotal.toFixed(2)}</td>
                                    </tr>
                                    ${order.discount > 0 ? `
                                    <tr>
                                        <td style="font-size:14px;color:#6c757d;">Discount</td>
                                        <td style="font-size:14px;color:#1a1a1a;text-align:right;">-LKR ${order.discount.toFixed(2)}</td>
                                    </tr>` : ''}
                                    <tr>
                                        <td style="font-size:14px;color:#6c757d;">Shipping</td>
                                        <td style="font-size:14px;color:#1a1a1a;text-align:right;">${order.shippingFee === 0 ? 'Free' : 'LKR ' + order.shippingFee.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size:16px;font-weight:500;">Total</td>
                                        <td style="font-size:16px;font-weight:500;text-align:right;">LKR ${order.total.toFixed(2)}</td>
                                    </tr>
                                </table>

                                <h3 style="font-size:16px;font-weight:500;text-transform:uppercase;margin-top:32px;margin-bottom:12px;">Shipping Address</h3>
                                <div style="background-color:#f8f9fa;border-radius:6px;padding:16px;font-size:14px;">
                                    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                                    ${order.shippingAddress.address}<br>
                                    ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                                    ${order.shippingAddress.country}<br><br>
                                    <strong>Phone:</strong> ${order.shippingAddress.phone}<br>
                                    <strong>Email:</strong> ${order.shippingAddress.email}
                                </div>

                                <p style="margin-top:32px;font-size:12px;color:#6c757d;line-height:1.6;">Your order will be processed within 1-2 business days. You'll receive a shipping confirmation with tracking information once your items are on their way.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px;text-align:center;background-color:#f8f9fa;border-top:1px solid #e9ecef;">
                                <div style="font-size:14px;color:#6c757d;margin-bottom:8px;">Thank you for choosing ${process.env.BRAND_NAME || 'World Store'}</div>
                                <div style="font-size:12px;color:#adb5bd;">Questions? Contact us at ${process.env.SUPPORT_EMAIL || 'teamframewall@gmail.com'}</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    return await sendMail({
        to: order.shippingAddress.email,
        subject: `Order Confirmation #${order.orderNumber}`,
        html
    });
};

export const mail_c_new_cartOrder = async (order) => {
    try {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const itemsHTML = order.items.map(item => {
            const attributes = Object.entries(item.attributes || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join(' • ');

            return `
                <tr>
                    <td style="padding: 24px 0; border-bottom: 1px solid #f5f5f5;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="80" style="padding-right: 20px; vertical-align: top;">
                                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #f0f0f0; display: block;" />
                                </td>
                                <td style="vertical-align: top;">
                                    <div style="font-size: 15px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">
                                        ${item.name}
                                    </div>
                                    ${attributes ? `
                                        <div style="font-size: 13px; color: #999999; margin-bottom: 8px;">
                                            ${attributes}
                                        </div>
                                    ` : ''}
                                    <div style="font-size: 13px; color: #666666;">
                                        Qty: ${item.quantity} × Rs ${item.price.toLocaleString()}.00
                                    </div>
                                </td>
                                <td style="vertical-align: top; text-align: right; padding-left: 20px;">
                                    <div style="font-size: 15px; font-weight: 500; color: #1a1a1a; white-space: nowrap;">
                                        Rs ${item.totalPrice.toLocaleString()}.00
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        }).join('');

        const emailContent = `
            <div class="email-body">
                
                <div style="text-align: center; margin-bottom: 48px;">
                    <h1 style="font-size: 24px; font-weight: 400; color: #1a1a1a; margin: 0 0 12px 0;">
                        Order Confirmed
                    </h1>
                    <p style="font-size: 14px; color: #666666; margin: 0;">
                        Thank you, ${order.shippingAddress.firstName}
                    </p>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                    <tr>
                        <td style="padding: 20px 0; border-top: 1px solid #f5f5f5; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Order Number
                                        </div>
                                        <div style="font-size: 15px; font-weight: 500; color: #1a1a1a;">
                                            ${order.orderNumber}
                                        </div>
                                    </td>
                                    <td style="text-align: right;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Date
                                        </div>
                                        <div style="font-size: 14px; color: #666666;">
                                            ${orderDate}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                    ${itemsHTML}
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 320px; margin-left: auto;">
                                <tr>
                                    <td style="padding: 10px 0; font-size: 14px; color: #666666;">
                                        Subtotal
                                    </td>
                                    <td style="padding: 10px 0; font-size: 14px; color: #1a1a1a; text-align: right;">
                                        Rs ${order.subtotal.toLocaleString()}.00
                                    </td>
                                </tr>
                                ${order.discount > 0 ? `
                                <tr>
                                    <td style="padding: 10px 0; font-size: 14px; color: #666666;">
                                        Discount
                                    </td>
                                    <td style="padding: 10px 0; font-size: 14px; color: #1a1a1a; text-align: right;">
                                        -Rs ${order.discount.toLocaleString()}.00
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 10px 0; font-size: 14px; color: #666666;">
                                        Shipping
                                    </td>
                                    <td style="padding: 10px 0; font-size: 14px; color: #1a1a1a; text-align: right;">
                                        ${order.shippingFee === 0 ? 'Free' : `Rs ${order.shippingFee.toLocaleString()}.00`}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 16px; border-top: 1px solid #f5f5f5;"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 16px 0 0 0; font-size: 15px; color: #1a1a1a; font-weight: 500;">
                                        Total
                                    </td>
                                    <td style="padding: 16px 0 0 0; font-size: 18px; color: #1a1a1a; font-weight: 500; text-align: right;">
                                        Rs ${order.total.toLocaleString()}.00
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                    <tr>
                        <td style="width: 50%; padding-right: 20px; vertical-align: top;">
                            <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                Delivery Address
                            </div>
                            <div style="font-size: 14px; color: #1a1a1a; line-height: 1.7;">
                                ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>
                                ${order.shippingAddress.address}<br/>
                                ${order.shippingAddress.city}<br/>
                                ${order.shippingAddress.postalCode || ''} ${order.shippingAddress.country}
                            </div>
                        </td>
                        <td style="width: 50%; padding-left: 20px; vertical-align: top;">
                            <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                Contact
                            </div>
                            <div style="font-size: 14px; color: #1a1a1a; line-height: 1.7;">
                                ${order.shippingAddress.phone}<br/>
                                ${order.shippingAddress.email}
                            </div>
                        </td>
                    </tr>
                </table>

            </div>
        `;
        const html = getBaseTemplate(emailContent);

        await sendMail({
            to: order.shippingAddress.email,
            subject: `Order Confirmation ${order.orderNumber}`,
            html
        });

        console.log('Customer order email sent to', order.shippingAddress.email);
    } catch (error) {
        console.error('Failed to send customer order email:', error);
    }
};


export const mail_order_status_changes = async (order, newStatus) => {
    try {
        const statusMessages = {
            pending: {
                title: 'Order Received',
                message: 'We have received your order and will begin processing it shortly.'
            },
            processing: {
                title: 'Order Processing',
                message: 'Your order is currently being prepared for shipment.'
            },
            paid: {
                title: 'Payment Confirmed',
                message: 'Your payment has been confirmed and your order is being processed.'
            },
            shipped: {
                title: 'Order Shipped',
                message: 'Great news! Your order has been shipped and is on its way to you.'
            },
            delivered: {
                title: 'Order Delivered',
                message: 'Your order has been delivered. We hope you enjoy your purchase!'
            },
            cancelled: {
                title: 'Order Cancelled',
                message: 'Your order has been cancelled. If you have any questions, please contact us.'
            }
        };

        const statusInfo = statusMessages[newStatus] || statusMessages.pending;

        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const emailContent = `
            <div class="email-body">
                
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 24px; font-weight: 400; color: #1a1a1a; margin: 0 0 12px 0;">
                        ${statusInfo.title}
                    </h1>
                    <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.6;">
                        ${statusInfo.message}
                    </p>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="background: #fafafa; border-radius: 4px; margin-bottom: 40px;">
                    <tr>
                        <td style="padding: 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 12px;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Order Number
                                        </div>
                                        <div style="font-size: 15px; font-weight: 500; color: #1a1a1a;">
                                            ${order.orderNumber}
                                        </div>
                                    </td>
                                    <td style="padding-bottom: 12px; text-align: right;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Status
                                        </div>
                                        <div style="font-size: 14px; font-weight: 500; color: #1a1a1a; text-transform: capitalize;">
                                            ${newStatus}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 12px; border-top: 1px solid #e0e0e0;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Order Date
                                        </div>
                                        <div style="font-size: 14px; color: #666666;">
                                            ${orderDate}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 300px; margin-left: auto;">
                                <tr>
                                    <td style="padding: 10px 0; font-size: 14px; color: #666666;">
                                        Order Total
                                    </td>
                                    <td style="padding: 10px 0; font-size: 16px; color: #1a1a1a; text-align: right; font-weight: 500;">
                                        Rs ${order.total.toLocaleString()}.00
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; padding: 32px 0; border-top: 1px solid #f5f5f5;">
                    <a href="${process.env.FRONTEND_URL || 'https://worldstore.com'}/track-order/${order._id}" 
                       style="display: inline-block; background: #1a1a1a; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 2px; font-size: 12px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;">
                        View Order
                    </a>
                </div>

            </div>
        `;

        const html = getBaseTemplate(emailContent);

        await sendMail({
            to: order.shippingAddress.email,
            subject: `Order Update: ${statusInfo.title} - ${order.orderNumber}`,
            html
        });

        console.log(`Status change email sent to ${order.shippingAddress.email} - Status: ${newStatus}`);
    } catch (error) {
        console.error('Failed to send status change email:', error);
    }
};
