const twilio = require('twilio');

module.exports = class SMS {
  constructor(user) {
    this.to = user.phone;
    this.firstName = user.name?.split(' ')[0] || '';
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  }

  async sendOTP() {
    try {
      const res = await this.client.verify.v2.services(this.serviceSid).verifications.create({
        to: this.to,
        channel: 'sms'
      });

      return { success: true, status: res.status };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async verifyOTP(code) {
    try {
      const res = await this.client.verify.v2.services(this.serviceSid).verificationChecks.create({
        to: this.to,
        code
      });

      return {
        success: res.status === 'approved',
        status: res.status
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};
