const nodemailer = require('nodemailer');

class EmailHelper {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendOTPEmail(email, otp) {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"IbikSocio" <noreply@ibiksocio.com>',
      to: email,
      subject: 'Kode OTP Verifikasi - IbikSocio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Verifikasi Email Anda</h2>
          <p>Terima kasih telah mendaftar di IbikSocio. Gunakan kode OTP berikut untuk verifikasi:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; letter-spacing: 10px; font-size: 32px;">${otp}</h1>
          </div>
          <p>Kode ini akan kadaluarsa dalam 10 menit.</p>
          <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">Email ini dikirim secara otomatis, mohon tidak membalas.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"IbikSocio" <noreply@ibiksocio.com>',
      to: email,
      subject: 'Selamat Datang di IbikSocio!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Selamat Datang di IbikSocio, ${name}!</h2>
          <p>Terima kasih telah bergabung dengan platform donasi bencana kami.</p>
          <p>Sekarang Anda dapat:</p>
          <ul>
            <li>Melakukan donasi untuk korban bencana</li>
            <li>Melihat perkembangan donasi secara real-time</li>
            <li>Mendapatkan update informasi bencana terkini</li>
            <li>Melacak riwayat donasi Anda</li>
          </ul>
          <p>Mari bersama-sama membantu mereka yang membutuhkan.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">IbikSocio - Platform Donasi Bencana Indonesia</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
}

module.exports = new EmailHelper();