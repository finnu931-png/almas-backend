const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        this.isConfigured = true;
        console.log('EmailService: SMTP transporter configured successfully');
      } else {
        console.log('SMTP credentials not configured, email notifications disabled');
      }
    } catch (error) {
      console.error('EmailService: Error configuring SMTP transporter:', error);
    }
  }

  async sendContactNotification(contactSubmission) {
    if (!this.isConfigured) {
      console.log('EmailService: SMTP not configured, skipping email notification');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New Contact Form Submission - ${contactSubmission.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactSubmission.name}</p>
          <p><strong>Email:</strong> ${contactSubmission.email}</p>
          <p><strong>Company:</strong> ${contactSubmission.company || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${contactSubmission.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${contactSubmission.subject}</p>
          <p><strong>Urgency:</strong> ${contactSubmission.urgency}</p>
          <p><strong>Preferred Contact:</strong> ${contactSubmission.preferredContact}</p>
          <p><strong>Message:</strong></p>
          <p>${contactSubmission.message}</p>
          <p><strong>Submitted:</strong> ${contactSubmission.createdAt}</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('EmailService: Contact notification email sent successfully');
    } catch (error) {
      console.error('EmailService: Error sending contact notification email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();