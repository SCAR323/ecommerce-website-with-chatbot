const { Resend } = require("resend");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Sonic Hub <onboarding@resend.dev>", // Note: For production, use your verified domain
            to,
            subject,
            html,
        });
        
        if (error) {
            console.error(`❌ Error sending email to ${to}:`, error);
            throw new Error(error.message);
        }
        
        console.log(`📧 Email sent to ${to}: ${subject}`);
        return data;
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message || error);
        throw error;
    }
};

const sendOrderConfirmation = async (email, name, orderId, amount) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">🛒 Order Confirmed</h2>
            <p>Hi ${name},</p>
            <p>Your order has been successfully placed!</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total Amount:</strong> ₹${amount}</p>
            </div>
            <p>We are processing your order and will notify you once it is shipped.</p>
            <p>Thank you for shopping with us!</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p><small style="color: #888;">This is an automated message.</small></p>
        </div>
    `;
    return sendEmail({ to: email, subject: "Order Confirmed - Sonic Hub", html });
};

const sendWelcomeEmail = async (email, name) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">🎉 Welcome to Our Store!</h2>
            <p>Hi ${name},</p>
            <p>Welcome to our electronics store! We're excited to have you onboard.</p>
            <p>You can now explore products, compare items, and enjoy a smart shopping experience with our AI assistant.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p><small style="color: #888;">If this wasn't you, please ignore this email.</small></p>
        </div>
    `;
    return sendEmail({ to: email, subject: "Welcome to Sonic Hub!", html });
};

const sendPaymentSuccessEmail = async (email, name, amount, paymentId) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #28a745;">💳 Payment Successful</h2>
            <p>Hi ${name},</p>
            <p>Your payment has been successfully processed.</p>
            <div style="background: #e9f7ef; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #28a745;">
                <p><strong>Amount Paid:</strong> ₹${amount}</p>
                <p><strong>Payment ID:</strong> ${paymentId}</p>
            </div>
            <p>Your order is now confirmed and will be shipped soon.</p>
            <p>Thank you for your purchase! ❤️</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p><small style="color: #888;">This is a secure payment confirmation.</small></p>
        </div>
    `;
    return sendEmail({ to: email, subject: "Payment Success - Sonic Hub", html });
};

module.exports = {
    sendOrderConfirmation,
    sendWelcomeEmail,
    sendPaymentSuccessEmail,
};
