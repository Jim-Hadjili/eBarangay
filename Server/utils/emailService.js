// utils/emailService.js
const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (to, firstName, rawToken) => {
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, CLIENT_URL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email configuration is missing. Set EMAIL_USER and EMAIL_PASS in environment variables.",
    );
  }

  // Create transporter lazily so env vars are guaranteed to be loaded
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE || "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const verifyUrl = `${CLIENT_URL}/verify-email?token=${rawToken}`;

  await transporter.sendMail({
    from: `"eBarangay Healthcare" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email – eBarangay Healthcare",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;padding:36px 32px;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
    
    <div style="text-align:center;margin-bottom:28px;">
      <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 6px;">Verify Your Email Address</h2>
      <p style="color:#6b7280;font-size:13px;margin:0;">eBarangay Healthcare Registration</p>
    </div>

    <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 12px;">Hi <strong>${firstName}</strong>,</p>
    <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Thank you for registering with <strong>eBarangay Healthcare</strong>. 
      Click the button below to verify your email address and complete your account setup.
    </p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${verifyUrl}"
        style="display:inline-block;padding:13px 36px;background:linear-gradient(to right,#4ade80,#22c55e);color:#ffffff;text-decoration:none;border-radius:12px;font-weight:700;font-size:14px;letter-spacing:0.3px;">
        ✉ Verify My Email
      </a>
    </div>

    <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:24px 0 0;">
      This verification link expires in <strong>1 hour</strong>. 
      If you did not create an account, you can safely ignore this email.
    </p>
    <p style="color:#9ca3af;font-size:11px;margin:8px 0 0;">
      If the button above doesn't work, copy and paste this link into your browser:<br/>
      <span style="color:#22c55e;word-break:break-all;">${verifyUrl}</span>
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
    <p style="color:#9ca3af;font-size:11px;text-align:center;margin:0;">
      © eBarangay Healthcare System
    </p>
  </div>
</body>
</html>
    `,
  });
};
