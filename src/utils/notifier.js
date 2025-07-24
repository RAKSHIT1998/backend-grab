// src/utils/notifier.js
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, subject, text, html = '') => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Grap SuperApp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error('Email sending error:', err.message);
  }
};

const sendSMS = async (phone, message) => {
  try {
    // Replace with your SMS gateway logic
    const response = await fetch(process.env.SMS_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SMS_API_KEY,
      },
      body: JSON.stringify({
        to: phone,
        message,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error('SMS error:', data);
    }
  } catch (err) {
    console.error('SMS sending error:', err.message);
  }
};

const sendPush = async (token, title, body) => {
  try {
    // OneSignal or Firebase logic here
    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_player_ids: [token],
        headings: { en: title },
        contents: { en: body },
      }),
    });
  } catch (err) {
    console.error('Push notification error:', err.message);
  }
};

export { sendEmail, sendSMS, sendPush };
