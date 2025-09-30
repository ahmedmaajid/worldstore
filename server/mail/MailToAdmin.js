import { sendMail, getBaseTemplate } from "./mailer.js";

export const newOrderAlert = async (order) => {
    // Process items with proper attribute handling (same as customer email)
    const itemsHtml = order.items.map(item => {
        // Handle attributes properly
        let attributesText = '';
        if (item.attributes) {
            if (item.attributes instanceof Map) {
                const attrs = Array.from(item.attributes.entries())
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                attributesText = attrs;
            } else if (typeof item.attributes === 'object') {
                const attrs = Object.entries(item.attributes)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                attributesText = attrs;
            }
        }

        return `
            <div class="item">
                <div class="item-info">
                    <div style="display: flex; align-items: flex-start; gap: 16px;">
                        ${item.image ? `
                            <div style="flex-shrink: 0;">
                                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #e9ecef;">
                            </div>
                        ` : ''}
                        <div style="flex: 1;">
                            <div class="item-name">${item.name}</div>
                            ${attributesText ? `<div class="item-variant">${attributesText}</div>` : ''}
                            <div style="margin-top: 8px; display: flex; gap: 16px; align-items: center; font-size: 14px; color: #6c757d;">
                                <span>Qty: ${item.quantity}</span>
                                <span>•</span>
                                <span>Unit: LKR ${item.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="item-price">LKR ${item.totalPrice.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const content = `
        <div class="email-body">
            <div class="greeting">
                New Order Received
            </div>
            
            <p style="margin-bottom: 32px; color: #d32f2f; font-weight: 500;">A new order has been placed and requires your attention.</p>
            
            <div class="content-section">
                <div class="section-title">Order Information</div>
                <div class="order-details">
                    <div class="order-header">
                        <div class="order-number">Order #${order.orderNumber}</div>
                        <div class="order-date">Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</div>
                    </div>
                    
                    <div class="order-items">
                        ${itemsHtml}
                    </div>
                    
                    <div class="order-summary">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal</span>
                            <span class="summary-value">LKR ${order.subtotal.toFixed(2)}</span>
                        </div>
                        ${order.discount > 0 ? `
                        <div class="summary-row">
                            <span class="summary-label">Discount</span>
                            <span class="summary-value">-LKR ${order.discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="summary-row">
                            <span class="summary-label">Shipping</span>
                            <span class="summary-value">${order.shippingFee === 0 ? 'Free' : 'LKR ' + order.shippingFee.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Total</span>
                            <span class="summary-value">LKR ${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <div class="section-title">Customer Information</div>
                <div class="info-box">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6c757d; margin-bottom: 4px;">Customer Name</div>
                            <div style="font-weight: 500;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6c757d; margin-bottom: 4px;">Order Status</div>
                            <div style="font-weight: 500; text-transform: capitalize;">${order.status || 'Processing'}</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6c757d; margin-bottom: 4px;">Email</div>
                            <div><a href="mailto:${order.shippingAddress.email}" style="color: #1a1a1a; text-decoration: none;">${order.shippingAddress.email}</a></div>
                        </div>
                        <div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6c757d; margin-bottom: 4px;">Phone</div>
                            <div><a href="tel:${order.shippingAddress.phone}" style="color: #1a1a1a; text-decoration: none;">${order.shippingAddress.phone || 'Not provided'}</a></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <div class="section-title">Shipping Address</div>
                <div class="shipping-info">
                    <div class="address">
                        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                        ${order.shippingAddress.country}
                    </div>
                </div>
            </div>


            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin-top: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 16px; height: 16px; background-color: #f39c12; border-radius: 50%;"></div>
                    <div style="font-weight: 500; color: #856404;">Action Required</div>
                </div>
                <div style="font-size: 14px; color: #856404; line-height: 1.6;">
                    This order needs to be processed and prepared for shipment. Please review the items and update the order status accordingly.
                </div>
            </div>
        </div>
    `;

    const html = getBaseTemplate(content, `New order #${order.orderNumber} received - LKR ${order.total.toFixed(2)}`);

    return await sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 New Order #${order.orderNumber} - LKR ${order.total.toFixed(2)}`,
        html
    });
};

// Update the base template with more refined styling
export const orderCancellation = async (order) => {
    const content = `
        <div class="email-body">
            <div class="greeting">
                Order Cancellation Alert
            </div>
            
            <p style="margin-bottom: 32px; color: #dc3545; font-weight: 500;">A customer has cancelled their order and requires your attention.</p>
            
            <div class="content-section">
                <div class="section-title">Cancelled Order Information</div>
                <div class="order-details">
                    <div class="order-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div class="order-number">Order #${order.orderNumber}</div>
                                <div class="order-date">Originally placed on ${new Date(order.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</div>
                            </div>
                            <span style="background-color: #f8d7da; color: #721c24; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                Cancelled
                            </span>
                        </div>
                    </div>
                    
                    <div class="order-summary" style="background-color: #fff; border-top: 1px solid #e9ecef;">
                        <div style="padding: 20px 24px;">
                            <div class="summary-row">
                                <span class="summary-label">Order Value</span>
                                <span class="summary-value">LKR ${order.total.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Items Count</span>
                                <span class="summary-value">${order.items.length} item${order.items.length > 1 ? 's' : ''}</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Cancelled On</span>
                                <span class="summary-value">${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <div class="section-title">Customer Information</div>
                <div class="info-box">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6c757d; margin-bottom: 4px;">Customer Name</div>
                            <div style="font-weight: 500;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6c757d; margin-bottom: 4px;">Email</div>
                            <div><a href="mailto:${order.shippingAddress.email}" style="color: #1a1a1a; text-decoration: none;">${order.shippingAddress.email}</a></div>
                        </div>
                    </div>
                </div>
            </div>

           

            <div style="background-color: #f8d7da; border: 1px solid #f1aeb5; border-radius: 6px; padding: 20px; margin-top: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 16px; height: 16px; background-color: #dc3545; border-radius: 50%;"></div>
                    <div style="font-weight: 500; color: #721c24;">Immediate Action Required</div>
                </div>
                <div style="font-size: 14px; color: #721c24; line-height: 1.6;">
                    Consider reaching out to the customer to understand the cancellation reason for future improvements.
                </div>
            </div>
        </div>
    `;

    const html = getBaseTemplate(content, `Order #${order.orderNumber} has been cancelled`);

    return await sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `❌ Order Cancelled #${order.orderNumber} - LKR ${order.total.toFixed(2)}`,
        html
    });
};

export const mail_a_new_cartOrder = async (order) => {
    try {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const itemsHTML = order.items.map(item => {
            const attributes = Object.entries(item.attributes || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join(' • ');

            return `
                <tr>
                    <td style="padding: 20px 0; border-bottom: 1px solid #f5f5f5;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="60" style="padding-right: 16px; vertical-align: top;">
                                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #f0f0f0; display: block;" />
                                </td>
                                <td style="vertical-align: top;">
                                    <div style="font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px;">
                                        ${item.name}
                                    </div>
                                    ${attributes ? `
                                        <div style="font-size: 12px; color: #999999; margin-bottom: 6px;">
                                            ${attributes}
                                        </div>
                                    ` : ''}
                                    <div style="font-size: 12px; color: #666666;">
                                        Qty: ${item.quantity} × Rs ${item.price.toLocaleString()}.00 = Rs ${item.totalPrice.toLocaleString()}.00
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
                
                <div style="background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 4px; margin-bottom: 32px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 500; letter-spacing: 0.5px;">
                        NEW ORDER RECEIVED
                    </div>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px; background: #fafafa; border-radius: 4px;">
                    <tr>
                        <td style="padding: 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Order Number
                                        </div>
                                        <div style="font-size: 16px; font-weight: 600; color: #1a1a1a;">
                                            ${order.orderNumber}
                                        </div>
                                    </td>
                                    <td style="padding-bottom: 16px; text-align: right;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Date & Time
                                        </div>
                                        <div style="font-size: 13px; color: #666666;">
                                            ${orderDate}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 12px; border-top: 1px solid #e0e0e0;">
                                        <div style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                            Customer
                                        </div>
                                        <div style="font-size: 14px; color: #1a1a1a;">
                                            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <div style="margin-bottom: 32px;">
                    <div style="font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                        Order Items
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        ${itemsHTML}
                    </table>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 300px; margin-left: auto; background: #fafafa; padding: 20px; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 8px 0; font-size: 13px; color: #666666;">
                                        Subtotal
                                    </td>
                                    <td style="padding: 8px 0; font-size: 13px; color: #1a1a1a; text-align: right; font-weight: 500;">
                                        Rs ${order.subtotal.toLocaleString()}.00
                                    </td>
                                </tr>
                                ${order.discount > 0 ? `
                                <tr>
                                    <td style="padding: 8px 0; font-size: 13px; color: #666666;">
                                        Discount ${order.coupon?.code ? `(${order.coupon.code})` : ''}
                                    </td>
                                    <td style="padding: 8px 0; font-size: 13px; color: #1a1a1a; text-align: right; font-weight: 500;">
                                        -Rs ${order.discount.toLocaleString()}.00
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 8px 0; font-size: 13px; color: #666666;">
                                        Shipping
                                    </td>
                                    <td style="padding: 8px 0; font-size: 13px; color: #1a1a1a; text-align: right; font-weight: 500;">
                                        ${order.shippingFee === 0 ? 'Free' : `Rs ${order.shippingFee.toLocaleString()}.00`}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 12px; border-top: 1px solid #e0e0e0;"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0 0 0; font-size: 15px; color: #1a1a1a; font-weight: 600;">
                                        Total
                                    </td>
                                    <td style="padding: 12px 0 0 0; font-size: 18px; color: #1a1a1a; font-weight: 600; text-align: right;">
                                        Rs ${order.total.toLocaleString()}.00
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <div style="background: #fafafa; padding: 24px; border-radius: 4px; margin-bottom: 32px;">
                    <div style="font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                        Shipping Details
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 50%; padding-right: 16px; vertical-align: top;">
                                <div style="font-size: 11px; color: #999999; margin-bottom: 8px;">
                                    ADDRESS
                                </div>
                                <div style="font-size: 13px; color: #1a1a1a; line-height: 1.6;">
                                    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>
                                    ${order.shippingAddress.address}<br/>
                                    ${order.shippingAddress.city}<br/>
                                    ${order.shippingAddress.postalCode || ''} ${order.shippingAddress.country}
                                </div>
                            </td>
                            <td style="width: 50%; padding-left: 16px; vertical-align: top;">
                                <div style="font-size: 11px; color: #999999; margin-bottom: 8px;">
                                    CONTACT
                                </div>
                                <div style="font-size: 13px; color: #1a1a1a; line-height: 1.6;">
                                    Phone: ${order.shippingAddress.phone}<br/>
                                    Email: ${order.shippingAddress.email}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

               

            </div>
        `;

        const html = getBaseTemplate(emailContent);

        await sendMail({
            to: process.env.ADMIN_EMAIL || process.env.SUPPORT_EMAIL,
            subject: `New Order ${order.orderNumber} - Rs ${order.total.toLocaleString()}.00`,
            html
        });

        console.log('Admin order notification sent');
    } catch (error) {
        console.error('Failed to send admin order notification:', error);
    }
};

