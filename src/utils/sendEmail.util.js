import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS, IS_DEV } from '../config/config.js';
import { ApiError } from '../utils/ApiError.util.js';
export async function sendEmail({ to, subject, html }) {
  try {
    // Create transporter with Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_PASS,
        pass: GMAIL_USER,
      },
    });

    // Define email options
    const mailOptions = {
      from: GMAIL_USER,
      to,
      subject,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    if (IS_DEV) {
      console.log('Email sent: ' + info.response);
    }
    return info;
  } catch (error) {
    if (IS_DEV) {
      console.error('Error sending email:', error);
    }
    throw ApiError.internalServerError('Error sending email', error);
  }
}
