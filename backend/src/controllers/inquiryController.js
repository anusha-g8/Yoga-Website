import * as InquiryModel from '../models/inquiryModel.js';

export const postInquiry = async (req, res) => {
  try {
    const { user_name, user_email, message } = req.body;
    if (!user_name || !user_email || !message) {
      return res.status(400).json({ message: 'Missing required inquiry fields' });
    }
    const newInquiry = await InquiryModel.createInquiry({ user_name, user_email, message });
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};
