import * as InquiryModel from '../models/inquiryModel.js';

export const postInquiry = async (req, res) => {
  try {
    const { user_name, user_email, message } = req.body;
    const newInquiry = await InquiryModel.createInquiry({ user_name, user_email, message });
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await InquiryModel.getAllInquiries();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const deleted = await InquiryModel.deleteInquiry(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
};
