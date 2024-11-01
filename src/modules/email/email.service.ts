import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class EmailService {
  private readonly mailerSendApiKey = process.env.MAILERSEND_API_KEY;

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const mailerSend = new MailerSend({
      apiKey: this.mailerSendApiKey,
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const sentFrom = new Sender('erp@placasexpress.com', 'Custom Place');

    const recipients = [new Recipient(to, to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Esqueci minha senha')
      .setHtml(
        `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      )
      .setText('This is the text content');

    await mailerSend.email
      .send(emailParams)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }
}
