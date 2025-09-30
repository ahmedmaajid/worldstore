// mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendMail = async ({ to, subject, text, html }) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.BRAND_NAME || 'Luxury Store'}" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log("Email sent to", to);
        return { success: true };
    } catch (err) {
        console.error("Email failed:", err);
        return { success: false, error: err.message };
    }
};

// Base template for consistent styling
export const getBaseTemplate = (content, preheader = "") => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Email</title>
        ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', Manrope;
                line-height: 1.6;
                color: #1a1a1a;
                background-color: #f8f9fa;
            }

            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }

            .email-header {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                padding: 40px 40px 30px;
                text-align: center;
                border-bottom: 1px solid #e9ecef;
            }

            .logo {
                font-size: 28px;
                font-weight: 300;
                letter-spacing: 3px;
                color: #1a1a1a;
                text-transform: uppercase;
                margin-bottom: 10px;
            }

            .email-body {
                padding: 40px;
            }

            .greeting {
                font-size: 18px;
                font-weight: 400;
                color: #1a1a1a;
                margin-bottom: 24px;
            }

            .content-section {
                margin-bottom: 32px;
            }

            .section-title {
                font-size: 16px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 16px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .info-box {
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 24px;
                margin-bottom: 24px;
            }

            .order-details {
                background-color: #ffffff;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                overflow: hidden;
            }

            .order-header {
                background-color: #f8f9fa;
                padding: 20px 24px;
                border-bottom: 1px solid #e9ecef;
            }

            .order-number {
                font-size: 18px;
                font-weight: 500;
                color: #1a1a1a;
            }

            .order-date {
                font-size: 14px;
                color: #6c757d;
                margin-top: 4px;
            }

            .order-items {
                padding: 0;
            }

            .item {
                padding: 24px;
                border-bottom: 1px solid #f1f3f4;
            }

            .item:last-child {
                border-bottom: none;
            }

            .item-info {
                width: 100%;
            }

            .item-name {
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 4px;
                font-size: 16px;
            }

            .item-variant {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 8px;
            }

            .item-price {
                font-weight: 500;
                color: #1a1a1a;
                font-size: 16px;
            }

            .order-summary {
                background-color: #f8f9fa;
                padding: 20px 24px;
            }

            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .summary-row:last-child {
                margin-bottom: 0;
                padding-top: 12px;
                border-top: 1px solid #e9ecef;
                font-weight: 500;
                font-size: 16px;
            }

            .summary-label {
                color: #6c757d;
            }

            .summary-value {
                color: #1a1a1a;
                font-weight: 400;
            }

            .summary-row:last-child .summary-label,
            .summary-row:last-child .summary-value {
                color: #1a1a1a;
                font-weight: 500;
            }

            .btn {
                display: inline-block;
                padding: 14px 32px;
                background-color: #1a1a1a;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }

            .btn:hover {
                background-color: #333333;
            }

            .btn-center {
                text-align: center;
                margin: 32px 0;
            }

            .shipping-info {
                background-color: #f8f9fa;
                border-radius: 6px;
                padding: 20px;
                margin-bottom: 24px;
            }

            .address {
                line-height: 1.8;
                color: #1a1a1a;
            }

            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                background-color: #e8f5e8;
                color: #2d5a2d;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .email-footer {
                background-color: #f8f9fa;
                padding: 32px 40px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }

            .footer-text {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 16px;
            }

            .contact-info {
                font-size: 12px;
                color: #adb5bd;
                line-height: 1.8;
            }

            @media only screen and (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }

                .email-header, .email-body, .email-footer {
                    padding: 24px 20px;
                }

                .info-box, .order-header, .item, .order-summary {
                    padding: 16px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <div class="logo">${process.env.BRAND_NAME || 'LUXE'}</div>
            </div>
            ${content}
            <div class="email-footer">
                <div class="footer-text">
                    Thank you for choosing ${process.env.BRAND_NAME || 'Luxe'}
                </div>
                <div class="contact-info">
                    Questions? Contact us at ${process.env.SUPPORT_EMAIL || 'teamframewall@gmail.com'}<br>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};


