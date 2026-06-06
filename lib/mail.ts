import nodemailer from 'nodemailer';

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Confirm your VendorBridge email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your VendorBridge password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
