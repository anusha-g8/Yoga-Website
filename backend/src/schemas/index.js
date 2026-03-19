import { z } from 'zod';

// Program Schema
export const programSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  level: z.string().min(1, 'Level is required'),
  duration: z.string().min(1, 'Duration is required'),
  price: z.preprocess((val) => parseFloat(val), z.number().positive('Price must be positive')),
  image_url: z.string().min(1, 'Image URL is required')
});

// Schedule Schema
export const scheduleSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  time: z.string().min(1, 'Time is required'),
  class_name: z.string().min(1, 'Class name is required'),
  level: z.string().min(1, 'Level is required')
});

// Booking Schema
export const bookingSchema = z.object({
  user_name: z.string().min(1, 'Name is required'),
  user_email: z.string().email('Invalid email format'),
  class_id: z.number().int().optional().nullable(),
  program_id: z.number().int().optional().nullable(),
  payment_status: z.string().optional().nullable(),
  stripe_payment_intent_id: z.string().optional().nullable()
}).refine(data => data.class_id || data.program_id, {
  message: "Either class_id or program_id must be provided",
  path: ["class_id"]
});

// Inquiry Schema
export const inquirySchema = z.object({
  user_name: z.string().min(1, 'Name is required'),
  user_email: z.string().email('Invalid email format'),
  message: z.string().min(1, 'Message is required')
});

// Video Schema
export const videoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional().nullable(),
  level: z.string().min(1, 'Level is required'),
  duration: z.string().min(1, 'Duration is required'),
  youtube_id: z.string().min(1, 'YouTube ID is required'),
  url: z.string().url('Invalid URL format').optional().nullable()
});

// Admin Login Schema
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});

// Member Schemas
export const memberRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const memberLoginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim()
});

// ID Parameter Schema
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number')
});
