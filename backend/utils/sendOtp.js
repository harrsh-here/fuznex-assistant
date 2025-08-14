// utils/sendOtp.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtp(email, otp) {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [email],
    subject: 'Your FuzNex OTP Code',
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
  });
}

module.exports = sendOtp;
