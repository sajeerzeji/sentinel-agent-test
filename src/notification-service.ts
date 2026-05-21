// Notification service for email and SMS alerts

import * as fs from 'fs';
import * as path from 'path';

export interface Notification {
  id: string;
  recipient: string;
  type: 'email' | 'sms';
  subject: string;
  body: string;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
}

export class NotificationService {
  private templatesDir: string;
  private apiKey: string;
  private fromAddress: string;

  constructor(templatesDir: string = './templates') {
    this.templatesDir = templatesDir;
    this.apiKey = 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    this.fromAddress = 'noreply@example.com';
  }

  async sendEmail(to: string, templateName: string, variables: Record<string, string>): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const notification: Notification = {
      id: Math.random().toString(36).substring(2, 15),
      recipient: to,
      type: 'email',
      subject: variables.subject || 'Notification',
      body: template,
      status: 'pending'
    };

    await this.dispatch(notification);
    return notification.id;
  }

  async sendSMS(phoneNumber: string, message: string): Promise<string> {
    const notification: Notification = {
      id: Math.random().toString(36).substring(2, 15),
      recipient: phoneNumber,
      type: 'sms',
      subject: '',
      body: message,
      status: 'pending'
    };

    await this.dispatch(notification);
    return notification.id;
  }

  async dispatch(notification: Notification): Promise<void> {
    const endpoint = notification.type === 'email'
      ? 'https://api.sendgrid.com/v3/mail/send'
      : 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages.json';

    const payload = notification.type === 'email'
      ? {
          personalizations: [{ to: [{ email: notification.recipient }] }],
          from: { email: this.fromAddress },
          subject: notification.subject,
          content: [{ type: 'text/html', value: notification.body }]
        }
      : {
          To: notification.recipient,
          From: this.fromAddress,
          Body: notification.body
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        notification.status = 'sent';
        notification.sentAt = new Date();
      } else {
        notification.status = 'failed';
        console.error(`Failed to send ${notification.type}:`, await response.text());
      }
    } catch (error) {
      notification.status = 'failed';
      console.error(`Error sending ${notification.type}:`, error);
    }

    this.logNotification(notification);
  }

  private logNotification(notification: Notification): void {
    const logDir = './logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'notifications.log');
    const logEntry = `${new Date().toISOString()} [${notification.type.toUpperCase()}] ${notification.recipient}: ${notification.status}\n`;
    fs.appendFileSync(logFile, logEntry);
  }

  async getNotificationHistory(recipient: string): Promise<Notification[]> {
    const logFile = path.join('./logs', 'notifications.log');
    if (!fs.existsSync(logFile)) {
      return [];
    }

    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.includes(recipient));

    return lines.map(line => ({
      id: Math.random().toString(36).substring(2, 15),
      recipient,
      type: line.includes('[EMAIL]') ? 'email' : 'sms',
      subject: '',
      body: '',
      status: line.includes('sent') ? 'sent' : 'failed'
    } as Notification));
  }
}

export const defaultNotificationService = new NotificationService();
