// src/utils/sms.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const sendSMS = async (phone, message) => {
  try {
    // Example: using Fast2SMS or custom provider
    const response = await fetch(process.env.SMS_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.SMS_API_KEY, // if required
      },
      body: JSON.stringify({
        to: phone,
        message,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error(`SMS Failed: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('SMS error:', error.message);
    return { success: false, error: error.message };
  }
};

export default sendSMS;
