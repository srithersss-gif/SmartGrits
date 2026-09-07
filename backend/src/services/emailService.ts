import { Configuration, SendApi } from 'hostinger-mail-api-sdk';

const getSendApi = () => {
  const token = process.env.HOSTINGER_MAIL_API_TOKEN;
  if (!token) return null;

  const config = new Configuration({
    accessToken: token,
  });
  return new SendApi(config);
};

export interface ContactNotificationData {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface QuoteNotificationData {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  remarks?: string;
  quoteId?: string;
}

export const sendContactNotificationEmail = async (data: ContactNotificationData): Promise<boolean> => {
  const sendApi = getSendApi();
  const mailboxId = process.env.HOSTINGER_MAILBOX_ID;
  const adminEmail = process.env.ADMIN_EMAIL || 'info@smartgrits.com';

  if (!sendApi || !mailboxId) {
    console.warn('Hostinger Mail API credentials not configured. Skipping email dispatch.');
    return false;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-top: 0;">New Website Contact Inquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 10px 8px; font-weight: bold; width: 130px; color: #475569;">Name:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Company:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.company || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Email:</td>
          <td style="padding: 10px 8px;"><a href="mailto:${data.email}" style="color: #10b981; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Phone:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Subject:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.subject}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px;">
        <strong style="color: #065f46;">Message:</strong>
        <p style="margin: 8px 0 0; white-space: pre-wrap; color: #1e293b; line-height: 1.6;">${data.message}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        Sent automatically from SmartGrits website contact form to <strong>${adminEmail}</strong>.
      </p>
    </div>
  `;

  const text = `
New Contact Inquiry from SmartGrits Website:
Name: ${data.firstName} ${data.lastName}
Company: ${data.company || 'N/A'}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Subject: ${data.subject}

Message:
${data.message}
  `.trim();

  try {
    await sendApi.sendEmail(mailboxId, {
      to: [adminEmail],
      displayName: 'SmartGrits Website',
      cc: [],
      bcc: [],
      subject: `New Website Inquiry: ${data.subject}`,
      html,
      text,
      attachments: [],
      inReplyTo: undefined as any,
      forwardOf: undefined as any,
    });
    console.log(`[Hostinger Mail API] Contact notification sent successfully to ${adminEmail}`);
    return true;
  } catch (error: any) {
    console.error('[Hostinger Mail API] Failed to send contact email:', error.response?.data || error.message);
    return false;
  }
};

export const sendQuoteNotificationEmail = async (data: QuoteNotificationData): Promise<boolean> => {
  const sendApi = getSendApi();
  const mailboxId = process.env.HOSTINGER_MAILBOX_ID;
  const adminEmail = process.env.ADMIN_EMAIL || 'info@smartgrits.com';

  if (!sendApi || !mailboxId) {
    console.warn('Hostinger Mail API credentials not configured. Skipping email dispatch.');
    return false;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-top: 0;">New Quote Request</h2>
      <p style="color: #64748b; font-size: 14px;">A new quote inquiry has been submitted on the SmartGrits website.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 10px 8px; font-weight: bold; width: 130px; color: #475569;">Name:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.fullName}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Company:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.companyName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Email:</td>
          <td style="padding: 10px 8px;"><a href="mailto:${data.email}" style="color: #10b981; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Phone:</td>
          <td style="padding: 10px 8px; color: #0f172a;">${data.phone || 'N/A'}</td>
        </tr>
        ${data.quoteId ? `
        <tr>
          <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Quote ID:</td>
          <td style="padding: 10px 8px; color: #0f172a; font-family: monospace;">${data.quoteId}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top: 20px; padding: 16px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px;">
        <strong style="color: #065f46;">Remarks / Product Requirements:</strong>
        <p style="margin: 8px 0 0; white-space: pre-wrap; color: #1e293b; line-height: 1.6;">${data.remarks || 'No additional remarks provided.'}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        Sent automatically from SmartGrits website quote form to <strong>${adminEmail}</strong>.
      </p>
    </div>
  `;

  const text = `
New Quote Request from SmartGrits Website:
Name: ${data.fullName}
Company: ${data.companyName || 'N/A'}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Quote ID: ${data.quoteId || 'N/A'}

Remarks:
${data.remarks || 'No remarks provided.'}
  `.trim();

  try {
    await sendApi.sendEmail(mailboxId, {
      to: [adminEmail],
      displayName: 'SmartGrits Website',
      cc: [],
      bcc: [],
      subject: `New Quote Request from ${data.fullName}`,
      html,
      text,
      attachments: [],
      inReplyTo: undefined as any,
      forwardOf: undefined as any,
    });
    console.log(`[Hostinger Mail API] Quote notification sent successfully to ${adminEmail}`);
    return true;
  } catch (error: any) {
    console.error('[Hostinger Mail API] Failed to send quote email:', error.response?.data || error.message);
    return false;
  }
};
