import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { getCurrentUser, hasActiveSubscription } from '../../../../lib/auth.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    if (user.role !== 'OWNER' || !hasActiveSubscription(user)) return NextResponse.json({ error: 'An active supplier subscription is required.' }, { status: 403 });

    const { to, subject, text } = await request.json();
    const recipient = String(to || '').trim().toLowerCase();
    const safeSubject = String(subject || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 180);
    const report = String(text || '').trim();
    if (!emailPattern.test(recipient) || !safeSubject || !report || report.length > 15_000) {
      return NextResponse.json({ error: 'The recipient or delivery report is invalid.' }, { status: 400 });
    }
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM || smtpUser;
    if (!host || !smtpUser || !smtpPassword || !from) {
      return NextResponse.json({ error: 'Email is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and SMTP_FROM in Vercel Environment Variables.' }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user: smtpUser, pass: smtpPassword },
    });
    const businessName = String(user.business_name || 'AquaFlow').replace(/[\r\n]+/g, ' ').trim();
    await transporter.sendMail({
      from,
      to: recipient,
      subject: `${safeSubject} · ${businessName}`.slice(0, 200),
      text: report.includes(businessName) ? report : `${report}\n\n${businessName}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delivery email failed:', error);
    return NextResponse.json({ error: 'Email could not be sent. Check the SMTP configuration and try again.' }, { status: 502 });
  }
}
