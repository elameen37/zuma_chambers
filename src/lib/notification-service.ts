// ─── Notification Service Types ────────────────────────────────
export type NotificationChannel = 'email' | 'sms' | 'whatsapp';

export interface NotificationPayload {
  recipient: {
    name: string;
    email?: string;
    phone?: string; // E.164 format: +2348012345678
  };
  subject: string;
  body: string;
  channel: NotificationChannel | NotificationChannel[];
  templateId?: string;
  metadata?: Record<string, string>;
}

export interface NotificationResult {
  channel: NotificationChannel;
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Notification Trigger Functions ────────────────────────────
export async function sendHearingReminder(payload: {
  counselName: string;
  clientName: string;
  suitNumber: string;
  hearingDate: string;
  court: string;
  counselEmail?: string;
  counselPhone?: string;
}): Promise<NotificationResult[]> {
  const body = `Dear ${payload.counselName},\n\nThis is a reminder that you have an upcoming court hearing:\n\nSuit: ${payload.suitNumber}\nClient: ${payload.clientName}\nCourt: ${payload.court}\nDate: ${payload.hearingDate}\n\nPlease ensure all filings are in order.\n\nRegards,\nZuma Chambers Secretariat`;

  return sendNotification({
    recipient: {
      name: payload.counselName,
      email: payload.counselEmail,
      phone: payload.counselPhone,
    },
    subject: `⚖️ Court Hearing Reminder — ${payload.suitNumber}`,
    body,
    channel: ['email', 'sms', 'whatsapp'],
  });
}

export async function sendDeadlineAlert(payload: {
  counselName: string;
  task: string;
  deadline: string;
  email?: string;
  phone?: string;
}): Promise<NotificationResult[]> {
  const body = `URGENT: Deadline Alert\n\nTask: ${payload.task}\nDeadline: ${payload.deadline}\n\nThis requires your immediate attention.\n— Zuma Chambers AI Risk Engine`;

  return sendNotification({
    recipient: { name: payload.counselName, email: payload.email, phone: payload.phone },
    subject: `🚨 Urgent Deadline — ${payload.task}`,
    body,
    channel: ['email', 'sms'],
  });
}

export async function sendInvoiceNotification(payload: {
  clientName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  email?: string;
  phone?: string;
}): Promise<NotificationResult[]> {
  const body = `Dear ${payload.clientName},\n\nPlease find attached Invoice ${payload.invoiceNumber} for ₦${payload.amount}.\n\nDue Date: ${payload.dueDate}\n\nKindly process payment at your earliest convenience.\n\nThank you,\nZuma Chambers Billing`;

  return sendNotification({
    recipient: { name: payload.clientName, email: payload.email, phone: payload.phone },
    subject: `Invoice ${payload.invoiceNumber} — ₦${payload.amount} Due`,
    body,
    channel: ['email', 'whatsapp'],
  });
}

// ─── Core Dispatcher ───────────────────────────────────────────
async function sendNotification(payload: NotificationPayload): Promise<NotificationResult[]> {
  const channels = Array.isArray(payload.channel) ? payload.channel : [payload.channel];
  
  const results = await Promise.allSettled(
    channels.map(channel => dispatchToAPI(channel, payload))
  );

  return results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    return { channel: channels[i], success: false, error: String(result.reason) };
  });
}

async function dispatchToAPI(channel: NotificationChannel, payload: NotificationPayload): Promise<NotificationResult> {
  try {
    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, payload }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { channel, success: true, messageId: data.messageId };
  } catch (err) {
    return { channel, success: false, error: String(err) };
  }
}
