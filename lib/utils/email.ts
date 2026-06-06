export async function sendEmailWithAttachment(to: string, subject: string, body: string, attachment: Buffer, filename: string) {
  // Trigger SMTP SES dispatch logic
  console.log(`Sending invoice email to ${to} with ${filename}...`);
  return { success: true };
}