-- Create Yoga Programs table
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  level VARCHAR(50),
  duration VARCHAR(50),
  price DECIMAL(10, 2),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Weekly Schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id SERIAL PRIMARY KEY,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(50) NOT NULL,
  class_name VARCHAR(100) NOT NULL,
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  class_id INTEGER REFERENCES schedule(id),
  program_id INTEGER REFERENCES programs(id),
  status VARCHAR(20) DEFAULT 'pending',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial data for programs
INSERT INTO programs (title, description, level, duration, price, image_url)
VALUES 
('Foundations of Yoga', 'Perfect for beginners to learn basic poses, alignment, and breathwork.', 'Beginner', '4 weeks', 59.00, '/assets/images/yoga1.jpg'),
('Vinyasa Mastery', 'Build strength and mobility with this intermediate flow sequence.', 'Intermediate', '6 weeks', 89.00, '/assets/images/yoga2.jpg'),
('Restorative Weekend', 'A gentle series focused on relaxation and stress reduction.', 'All levels', 'Single Workshop', 25.00, '/assets/images/yoga3.jpg');

-- Seed initial data for schedule
INSERT INTO schedule (day, time, class_name, level)
VALUES 
('Monday', '08:00 - 09:00', 'Morning Flow', 'All levels'),
('Wednesday', '18:00 - 19:15', 'Hatha Yoga', 'Beginner'),
('Friday', '07:30 - 08:30', 'Vinyasa Flow', 'Intermediate'),
('Saturday', '10:00 - 11:30', 'Weekend Workshop', 'Advanced');
