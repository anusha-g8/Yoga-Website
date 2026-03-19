import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER and EMAIL_PASS are not set. Simulation mode.');
    console.log(`To: ${to}, Subject: ${subject}, Message: ${text}`);
    return { success: true, message: 'Simulation mode' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to ' + to + ': ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Email send error for ' + to + ':', error.message);
    throw error;
  }
};

export const broadcastEmail = async (recipients, subject, text) => {
  const promises = recipients.map(email => sendEmail(email, subject, text));
  return Promise.allSettled(promises);
};
