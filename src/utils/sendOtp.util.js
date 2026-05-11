import { ApiError } from './ApiError.util.js';
import { sendEmail } from './sendEmail.util.js';
export const sendOtp = async (email, otp) => {
  const mailBody = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
      <tr>
        <td style="padding: 30px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">OTP Verification</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
            Hello,<br><br>
            Your One-Time Password (OTP) for verification is:
          </p>
          <p style="font-size: 28px; font-weight: bold; color: #e63946; margin: 20px 0;">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #555; margin-bottom: 30px;">
            Please enter this code within the next <strong>10 minutes</strong> to complete your verification.<br>
            For your security, do not share this code with anyone.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">
            Thank you,<br>
            Support Team
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  const subject = 'Your OTP Verification Code';

  try {
    await sendEmail({ to: email, subject, html: mailBody });
    return true;
  } catch (error) {
    throw ApiError.internalServerError('OTP sending faild');
  }
};
