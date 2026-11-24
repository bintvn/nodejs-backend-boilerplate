import { createTransport } from 'nodemailer';
import {
  SMTP_FROM_EMAIL,
  SMTP_HOST,
  SMTP_LOGIN_EMAIL,
  SMTP_LOGIN_PASSWORD,
  SMTP_PORT,
  SMTP_SECURE,
} from '../constants.js';

const transporter = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  tls: !SMTP_SECURE
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
  auth: {
    user: SMTP_LOGIN_EMAIL,
    pass: SMTP_LOGIN_PASSWORD,
  },
});

export async function sendMail(
  toEmail: string,
  subject: string,
  text: string,
  html?: string,
) {
  if (!transporter.options.host || !transporter.options.port) return;

  const result = await transporter.sendMail({
    subject,
    from: SMTP_FROM_EMAIL,
    to: toEmail,
    text,
    html,
  });

  return result;
}
