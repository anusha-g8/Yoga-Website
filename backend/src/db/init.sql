-- 1. Create tables if they don't exist
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

CREATE TABLE IF NOT EXISTS schedule (
  id SERIAL PRIMARY KEY,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(50) NOT NULL,
  class_name VARCHAR(100) NOT NULL,
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  level VARCHAR(50),
  duration VARCHAR(50),
  youtube_id VARCHAR(50) NOT NULL,
  url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ensure unique constraints exist for handling conflicts
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'programs_title_key') THEN
        ALTER TABLE programs ADD CONSTRAINT programs_title_key UNIQUE (title);
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schedule_unique_class') THEN
        ALTER TABLE schedule ADD CONSTRAINT schedule_unique_class UNIQUE (day, time, class_name);
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_youtube_id_key') THEN
        ALTER TABLE videos ADD CONSTRAINT videos_youtube_id_key UNIQUE (youtube_id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Remaining tables
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  class_id INTEGER REFERENCES schedule(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed initial data
INSERT INTO programs (title, description, level, duration, price, image_url)
VALUES 
('Foundations of Yoga', 'Perfect for beginners to learn basic poses, alignment, and breathwork.', 'Beginner', '4 weeks', 59.00, '/assets/images/yoga1.jpg'),
('Vinyasa Mastery', 'Build strength and mobility with this intermediate flow sequence.', 'Intermediate', '6 weeks', 89.00, '/assets/images/yoga2.jpg'),
('Restorative Weekend', 'A gentle series focused on relaxation and stress reduction.', 'All levels', 'Single Workshop', 25.00, '/assets/images/yoga3.jpg')
ON CONFLICT (title) DO NOTHING;

INSERT INTO schedule (day, time, class_name, level)
VALUES 
('Monday', '08:00 - 09:00', 'Morning Flow', 'All levels'),
('Wednesday', '18:00 - 19:15', 'Hatha Yoga', 'Beginner'),
('Friday', '07:30 - 08:30', 'Vinyasa Flow', 'Intermediate'),
('Saturday', '10:00 - 11:30', 'Weekend Workshop', 'Advanced')
ON CONFLICT (day, time, class_name) DO NOTHING;

INSERT INTO videos (title, description, level, duration, youtube_id, url)
VALUES 
('Easy Morning Yoga For Beginners', 'A gentle and effective morning flow to wake up your body and mind.', 'Beginner', '15:12', 'Y2RcO6TKO4s', 'https://www.youtube.com/watch?v=Y2RcO6TKO4s&vl=en'),
('Full Body Flow - Breathe & Release', 'A powerful full body flow to release tension and build strength.', 'All levels', '20:15', 'ZAlpjTIe0DA', 'https://www.youtube.com/watch?v=ZAlpjTIe0DA&t=913s')
ON CONFLICT (youtube_id) DO NOTHING;
