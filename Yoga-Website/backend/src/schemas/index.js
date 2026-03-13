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
  program_id: z.number().int().optional().nullable()
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

// Admin Login Schema
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

// ID Parameter Schema
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number')
});
