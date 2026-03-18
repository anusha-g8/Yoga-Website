import * as BookingModel from '../models/bookingModel.js';

export const postBooking = async (req, res) => {
  try {
    const { user_name, user_email, class_id, program_id } = req.body;
    const newBooking = await BookingModel.createBooking({ user_name, user_email, class_id, program_id });
    res.status(201).json(newBooking);
  } catch (error) {
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
