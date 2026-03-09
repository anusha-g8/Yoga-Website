# Yoga-Website

Full stack development project for yoga website.

## Getting Started

### 1. Database Setup
Ensure you have **PostgreSQL** installed and running on your machine.
- Create a database named `yoga_db`.
- Execute the SQL commands in `backend/src/db/init.sql` to create the tables and seed initial data.
- The default credentials in `backend/.env` are:
  - User: `postgres`
  - Password: `postgres` (Update this file if your local setup is different)
  - Port: `5432`

### 2. Run the Application
From the `Yoga-Website` directory, run:
```bash
npm run dev
```
This will start:
- **Backend:** `http://localhost:5001`
- **Frontend:** `http://localhost:5173`

The frontend uses a proxy to communicate with the backend via `/api`.

### 3. Features
- **Schedule:** View the class schedule fetched from the database on the Calendar page.
- **Booking:** Click "Book Class" in the schedule to book a session.
- **Courses:** Browse and enroll in online yoga programs on the Courses page.
- **Inquiries:** Submit messages via the Contact page.
