# PostgreSQL Database Setup Guide

## Prerequisites

1. **Install PostgreSQL** (if not already installed):
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

## Setup Steps

### 1. Create the Database

Connect to PostgreSQL and create the database:

```sql
-- Using psql command line
psql -U postgres

-- Create the database
CREATE DATABASE college_events;
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file in the project root to customize database connection:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=college_events
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your-super-secret-key-change-in-production
```

### 3. Initialize Database Tables

Run the initialization script:

```bash
npm run init-db
```

This creates:

- `students` table (id, roll_number, email, password, name, department, year)
- `event_registrations` table (tracks which events students registered for)

### 4. Start the Backend Server

```bash
npm run server
```

The server runs on `http://localhost:5000`

### 5. Start the Frontend

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register a new student       |
| POST   | `/api/auth/login`    | Login with roll number/email |
| GET    | `/api/auth/profile`  | Get current student profile  |

### Events

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | `/api/events/register`         | Register for an event           |
| GET    | `/api/events/my-registrations` | Get student's registered events |

## Default Credentials

The database uses these default connection settings:

- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: college_events

## Troubleshooting

### Connection Error

- Ensure PostgreSQL service is running
- Check if the database `college_events` exists
- Verify credentials in `server.js` match your PostgreSQL setup

### Permission Error

- Make sure the postgres user has permission to create tables
- Run with appropriate privileges

## Student Login Features

Students can:

1. Register with roll number, email, password, name, department, and year
2. Login using either roll number OR email
3. View their profile
4. Register for events (stored in database)
5. View their registered events
