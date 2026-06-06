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

export class MailService {
  static async sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${domain}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Confirm your VendorBridge email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    });
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${domain}/new-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Reset your VendorBridge password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  }

  static async sendRFQNotificationEmail(email: string, rfqTitle: string, rfqId: string) {
    const rfqLink = `${domain}/rfqs/${rfqId}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `New Request for Quotation: ${rfqTitle}`,
      html: `
        <h2>You have been invited to participate in a new RFQ!</h2>
        <p><strong>RFQ Title:</strong> ${rfqTitle}</p>
        <p>Please log in to your VendorBridge portal to review the line items and submit your quotation before the deadline.</p>
        <p><a href="${rfqLink}">Click here to view the RFQ</a></p>
      `,
    });
  }
}
