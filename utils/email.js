const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url, otp, order) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.otp = otp;
    this.order = order;
    this.from = `E-commerce-App <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      otp: this.otp,
      order: this.order,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Our App! We’re excited to have you');
  }

  async sendOrderEmail() {
    await this.send('orderConfirmation', 'Your order has been placed successfully!');
  }
};
