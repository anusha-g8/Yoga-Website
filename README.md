# Yoga Website Project

A full-stack yoga instructor platform with a React frontend, Node.js/Express backend, and PostgreSQL database. Deployed using a modern AWS architecture with S3, CloudFront, and EC2.

---

## 🌍 Environment & Deployment Details

### 1. Production (Live)
The stable, public-facing version of the application.
- **Frontend (HTTPS/CDN):** [https://d2wyh3p9dtg0ey.cloudfront.net](https://d2wyh3p9dtg0ey.cloudfront.net)
- **Backend API (Direct):** `http://3.76.81.81:5005/api`
- **Infrastructure:** S3 + CloudFront (Frontend), EC2 with Docker (Backend/DB).
- **Region:** `eu-central-1` (Frankfurt).

### 2. Staging (Testing)
Used for validating changes before production.
- **Frontend (HTTPS/CDN):** [https://d3d5zpzj4lgzr9.cloudfront.net](https://d3d5zpzj4lgzr9.cloudfront.net)
- **Backend API (Direct):** `http://63.177.77.10:5005/api`
- **Infrastructure:** S3 + CloudFront (Frontend), EC2 with Docker (Backend/DB).

### 3. Development (Local)
Local environment for active development.
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:5002](http://localhost:5002)
- **Database:** Local PostgreSQL on port `5432`.

---

## 🛠 Architecture & Networking

### **CloudFront Reverse Proxy**
To avoid **Mixed Content** errors (HTTPS frontend calling HTTP backend), both CloudFront distributions are configured as a reverse proxy:
- Requests to `/api/*` on the CDN are automatically routed to the corresponding EC2 backend on port **5005**.
- This allows the frontend to use relative paths (e.g., `fetch('/api/health')`).

### **Backend Ports**
| Service | Host Port | Container Port | Description |
| :--- | :--- | :--- | :--- |
| **Backend API** | `5005` | `5000` | Node.js Express server. |
| **Database** | `5435` | `5432` | PostgreSQL (Docker). |

---

## 🚀 Deployment Usage

### **1. Deploying Staging Frontend**
Ensure `frontend/src/config.js` is set to `export const API_BASE_URL = '/api';`.
```bash
./deploy-s3.sh
```
*Note: This script builds the frontend and syncs it to the staging S3 bucket.*

### **2. Launching Staging Backend**
```bash
./launch-staging-ec2.sh
```
*Note: This script launches the EC2 instance, installs Docker, and starts the services.*

### **3. Production Deployment**
Production follows the same pattern but uses the production S3 bucket and EC2 instance. Ensure the CloudFront invalidation is run after updating S3 assets:
```bash
aws cloudfront create-invalidation --distribution-id <PROD_DIST_ID> --paths "/*"
```

---

## 📂 Project Structure
- `frontend/`: React + Vite application.
- `backend/`: Node.js Express API.
- `backend/src/db/init.sql`: Database schema and initial data.
- `docker-compose.yml`: Local and Staging orchestration.
- `docker-compose.prod.yml`: Production orchestration.

---

## 🧪 API Endpoints
- `GET /api/health`: System health and DB connection status.
- `GET /api/schedule`: Fetch class schedules.
- `GET /api/programs`: Fetch yoga courses/packages.
- `POST /api/bookings`: Create a new booking.
- `POST /api/inquiries`: Submit a contact form inquiry.
- `POST /api/admin/login`: Administrator authentication.
- `GET /api/admin/dashboard`: Protected admin data (Bookings, Inquiries).

---

## 🔐 Access & Security
- **SSH Access:** Requires `yoga-key.pem`.
- **Admin Login:** Access the dashboard at `/admin` on the frontend.
- **Security Groups:** 
    - Port `22` (SSH), `5000`, `5005` (API), and `8080` (Direct Frontend) are open on EC2.
    - CloudFront uses **Origin Access Control (OAC)** to securely fetch assets from private S3 buckets.
