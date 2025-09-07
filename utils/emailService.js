const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `TaskFlow <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Email could not be sent");
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - TaskFlow</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>TaskFlow - Task Management System</p>
          </div>
          <div class="content">
            <h2>Hello there!</h2>
            <p>We received a request to reset your password for your TaskFlow account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetURL}" class="button">Reset My Password</a>
            </div>
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 10 minutes</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>For security, never share this link with anyone</li>
              </ul>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetURL}</p>
          </div>
          <div class="footer">
            <p>© 2024 TaskFlow. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      email,
      subject: "🔐 Password Reset Request - TaskFlow",
      html,
    });
  }

  async sendWelcomeEmail(email, name) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TaskFlow</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .feature { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TaskFlow!</h1>
            <p>Your journey to better productivity starts here</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Welcome to TaskFlow - the smart task management platform that helps you stay organized and productive.</p>
            
            <h3>🚀 What you can do with TaskFlow:</h3>
            <div class="feature">
              <strong>📝 Create & Manage Tasks</strong><br>
              Easily create, edit, and organize your tasks with priorities and categories.
            </div>
            <div class="feature">
              <strong>🔍 Smart Search & Filter</strong><br>
              Find your tasks quickly with powerful search and filtering options.
            </div>
            <div class="feature">
              <strong>📊 Track Progress</strong><br>
              Monitor your productivity with detailed analytics and completion rates.
            </div>
            <div class="feature">
              <strong>📱 Mobile Responsive</strong><br>
              Access your tasks anywhere, anytime, on any device.
            </div>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Managing Tasks</a>
            </div>
            
            <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 TaskFlow. All rights reserved.</p>
            <p>Happy task managing! 🎯</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      email,
      subject: "🎉 Welcome to TaskFlow - Let's Get Started!",
      html,
    });
  }
}

module.exports = new EmailService();
