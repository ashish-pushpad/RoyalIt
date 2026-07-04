# Lead Management Mini CRM

A simple admin-driven CRM built with React, Express, and SQLite.

## Features
- Admin login
- Dashboard metrics for total, new, follow-up, converted, and lost leads
- CRUD for leads
- Search and status filtering
- Employee progress summary

## Admin credentials
- Email: admin@crm.com
- Password: admin123

## Employee credentials
-  Email: ash@ash.com 
- Password :1234

## Setup
1. Install dependencies:
   - npm install
   - npm --prefix backend install
   - npm --prefix frontend install
2. Start the app:
   - npm run dev
3. Open:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5010

## Database
The app uses SQLite via better-sqlite3. No separate database server is required.
The database file is created automatically at backend/crm.db.
