import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ─── Unified Notification API Route ─────────────────────────────
// POST /api/notifications/send
export async function POST(req: NextRequest) {
  try {
    const { channel, payload } = await req.json();

    let result;

    switch (channel) {
      case 'email':
        result = await sendEmail(payload);
        break;
      case 'sms':
        result = await sendSMS(payload);
        break;
      case 'whatsapp':
        result = await sendWhatsApp(payload);
        break;
      default:
        return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Notification API Error]', err);
    return NextResponse.json({ error: 'Notification dispatch failed' }, { status: 500 });
  }
}

interface NotificationPayload {
  recipient: {
    email?: string;
    phone?: string;
  };
  subject: string;
  body: string;
}

// ─── Email via Resend ────────────────────────────────────────────
async function sendEmail(payload: NotificationPayload) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const { data, error } = await resend.emails.send({
    from: 'Zuma Chambers <notifications@zumachambers.ng>',
    to: payload.recipient.email ? [payload.recipient.email] : [],
    subject: payload.subject,
    text: payload.body,
    html: buildEmailHTML(payload),
  });

  if (error) throw new Error(error.message);
  return { messageId: data?.id, channel: 'email' };
}

function buildEmailHTML(payload: NotificationPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a0a 100%); border-bottom: 2px solid #D4AF37; padding: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 3px; }
    .tagline { color: #888; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; margin-top: 6px; }
    .body { padding: 30px; background: #111; border: 1px solid #222; }
    .subject { font-size: 20px; font-weight: bold; color: #fff; margin-bottom: 20px; border-left: 3px solid #D4AF37; padding-left: 12px; }
    .content { color: #ccc; line-height: 1.8; white-space: pre-wrap; font-size: 14px; }
    .footer { text-align: center; padding: 20px; color: #555; font-size: 11px; border-top: 1px solid #1a1a1a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚖ ZUMA CHAMBERS</div>
      <div class="tagline">Enterprise Legal Intelligence</div>
    </div>
    <div class="body">
      <div class="subject">${payload.subject}</div>
      <div class="content">${payload.body}</div>
    </div>
    <div class="footer">
      This communication is strictly confidential and intended solely for the named recipient.<br/>
      © ${new Date().getFullYear()} Zuma Chambers. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

// ─── SMS via Termii (Nigerian Provider) ──────────────────────────
async function sendSMS(payload: NotificationPayload) {
  const phone = payload.recipient.phone;
  if (!phone) throw new Error('No phone number provided');

  const res = await fetch('https://api.ng.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phone,
      from: 'ZumaChambers',
      sms: payload.body.substring(0, 160), // SMS character limit
      type: 'plain',
      channel: 'generic',
      api_key: process.env.TERMII_API_KEY!,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Termii SMS failed: ${error}`);
  }

  const data = await res.json() as { message_id: string };
  return { messageId: data.message_id, channel: 'sms' };
}

// ─── WhatsApp via Meta Cloud API ──────────────────────────────────
async function sendWhatsApp(payload: NotificationPayload) {
  const phone = payload.recipient.phone;
  if (!phone) throw new Error('No phone number provided');

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace('+', ''),
        type: 'text',
        text: { body: payload.body },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json() as Record<string, unknown>;
    throw new Error(`WhatsApp API failed: ${JSON.stringify(error)}`);
  }

  const data = await res.json() as { messages?: { id: string }[] };
  return { messageId: data.messages?.[0]?.id, channel: 'whatsapp' };
}
