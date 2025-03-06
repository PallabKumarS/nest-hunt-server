import nodemailer from 'nodemailer';
import config from '../config';

// Base email sending function
const sendEmail = async (email: string, html: string, subject: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.sender_email,
        pass: config.sender_app_pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email configuration
    const mailOptions: any = {
      from: '"NestHunt" <support@nesthunt.com>',
      to: email,
      subject,
      html,
    };

    // Sending the email
    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Email for Request Status Change
export const sendRequestStatusChangeEmail = async (
  email: string,
  requestId: string,
  newStatus: string,
  listingId: string,
  location: string,
) => {
  const subject = `Request Status Update - ${requestId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Request Status Update</h2>
      <p>Dear User,</p>
      <p>Your request for the listing <strong>${listingId}, located at ${location}</strong> has been updated.</p>
      <p>Current Status: <span style="color: blue;">${newStatus}</span></p>
      <p>Request ID: ${requestId}</p>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>NestHunt Team</p>
    </div>
  `;

  return sendEmail(email, html, subject);
};

// Email for Payment Confirmation
export const sendPaymentConfirmationEmail = async (
  email: string,
  requestId: string,
  paymentId: string,
  listingTitle: string,
  amount: number,
) => {
  const subject = `Payment Confirmation - ${requestId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Payment Confirmation</h2>
      <p>Dear User,</p>
      <p>Your payment for the listing <strong>${listingTitle}</strong> has been successfully processed.</p>
      <p>Payment Details:</p>
      <ul>
        <li>Request ID: ${requestId}</li>
        <li>Payment ID: ${paymentId}</li>
        <li>Amount Paid: $${amount.toFixed(2)}</li>
      </ul>
      <p>Thank you for your payment. Enjoy your booking!</p>
      <p>Best regards,<br>NestHunt Team</p>
    </div>
  `;

  return sendEmail(email, html, subject);
};
