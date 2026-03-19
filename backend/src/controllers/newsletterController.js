import * as NewsletterModel from '../models/newsletterModel.js';
import * as MemberModel from '../models/memberModel.js';
import * as EmailService from '../utils/emailService.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await NewsletterModel.subscribe(email);
    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing to newsletter', error: error.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterModel.getAllSubscribers();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscribers', error: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const deleted = await NewsletterModel.unsubscribe(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Unsubscribed successfully', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error unsubscribing', error: error.message });
  }
};

export const sendEmailToAll = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const subscribers = await NewsletterModel.getAllSubscribers();
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No subscribers to send emails to' });
    }

    console.log(`Broadcasting email to ${subscribers.length} subscribers...`);
    const emails = subscribers.map(s => s.email);
    const results = await EmailService.broadcastEmail(emails, subject, message);
    
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({ 
      message: `Email broadcast completed. Success: ${succeeded}, Failed: ${failed}`,
      recipientCount: subscribers.length,
      successCount: succeeded,
      failCount: failed
    });
  } catch (error) {
    console.error('Broadcast Error:', error);
    res.status(500).json({ message: 'Error sending broadcast', error: error.message });
  }
};
