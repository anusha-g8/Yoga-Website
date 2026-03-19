import Stripe from 'stripe';
import * as ProgramModel from '../models/programModel.js';
import * as BookingModel from '../models/bookingModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Payment Intent for a program/class
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { program_id, user_email } = req.body;

    if (!program_id) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    // Fetch program details to get the price
    const programs = await ProgramModel.getAllPrograms();
    const program = programs.find(p => p.id === parseInt(program_id));

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const amount = Math.round(program.price * 100); // Stripe expects amounts in cents/cents-equivalent

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur', // We changed prices to Euros
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        program_id: program.id.toString(),
        user_email: user_email
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

/**
 * Webhook handler for Stripe events
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    
    // Update booking status in database if we have a match
    // Note: In a full implementation, we'd use the metadata to find the booking
  }

  res.json({ received: true });
};
