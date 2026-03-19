import * as BookingModel from '../models/bookingModel.js';
import * as MemberModel from '../models/memberModel.js';

export const postBooking = async (req, res) => {
  console.log('Post booking attempt. memberId from auth:', req.memberId);
  try {
    const { user_name, user_email, class_id, program_id, payment_status, stripe_payment_intent_id } = req.body;
    
    let memberId = req.memberId;
    
    // Fallback: If no token was used, try to find member by email
    if (!memberId && user_email) {
      const existingMember = await MemberModel.getMemberByEmail(user_email);
      if (existingMember) {
        memberId = existingMember.id;
        console.log('Found member by email for guest booking:', memberId);
      }
    }

    const newBooking = await BookingModel.createBooking({ 
      user_name, 
      user_email, 
      class_id, 
      program_id,
      member_id: memberId || null,
      payment_status,
      stripe_payment_intent_id
    });
    console.log('New booking created with member_id:', newBooking.member_id);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Missing status field' });
    }
    const updatedBooking = await BookingModel.updateBookingStatus(id, status);
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await BookingModel.deleteBooking(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};
