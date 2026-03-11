# Yoga-Website

Full stack development project for yoga website.

## Getting Started

### 1. Database Configuration
The application points to different databases depending on the environment. **Note: Staging and Production require the database to listen on port 5435.**

| Environment | Database Host | DB Port | SSL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `localhost` | **5432** | No | Your local PostgreSQL installation. |
| **Staging** | `AWS RDS (Staging)` | **5435** | Yes | Shared AWS RDS instance. |
| **Production** | `AWS RDS (Prod)` | **5435** | Yes | Dedicated AWS RDS (to be created). |

> **⚠️ AWS Configuration Requirement:**
> To use port **5435** in Staging/Production, you must:
> 1. Modify the RDS instance settings in AWS to change the port from `5432` to `5435`.
> 2. Update the RDS Security Group Inbound Rules to allow traffic on port `5435`.

### 2. Run the Application

#### **Development (Local)**
Points to your **local PostgreSQL** database.
```bash
npm run dev
```
- **Backend:** `http://localhost:5002`
- **Frontend:** `http://localhost:5173`

#### **Staging (Docker)**
Points to the **AWS Staging RDS** on port **5435**.
```bash
npm run staging
```
- **Frontend:** `http://localhost:80`
- **Backend:** `http://localhost:5005` (exposed externally)
- **Database:** `localhost:5435` (exposed if connecting via external tool)

#### **Production (Docker)**
Points to the **AWS Production RDS** on port **5435**.
```bash
npm run production
```
- **Frontend:** `http://localhost:80`
- **Backend:** `http://localhost:5005` (exposed externally)
- **Database:** `localhost:5435` (exposed if connecting via external tool)

### 3. Features
- **Schedule:** View class schedules fetched from the database.
- **Booking:** Real-time session booking.
- **Courses:** Online yoga program enrollment.
- **Inquiries:** Contact form messaging.
