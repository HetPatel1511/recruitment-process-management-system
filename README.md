# Recruitment Process Management System

## Introduction

Recruitment Process Management System is a full-stack web application designed to manage the end-to-end hiring workflow. It helps organizations create and manage job positions, handle candidate applications, and maintain structured candidate/user data in one place. The project includes an ASP.NET Core (.NET 8) backend API with SQL Server for data storage and a React frontend that provides the user interface for recruiters and applicants.

## Tech Stack

- **Backend**
  - ASP.NET Core Web API (.NET 8)
  - Entity Framework Core (EF Core)
- **Frontend**
  - React
  - Redux Toolkit
  - Tailwind CSS
- **Database**
  - Microsoft SQL Server (SQL Express)

## Quick Start

### Backend

```bash
cd Backend
dotnet restore
dotnet run
```

- API base URL: `http://localhost:5041`

### Frontend

```bash
cd frontend
npm install
npm start
```

- App: `http://localhost:3000`

---

This repository contains:

- `Backend/` - ASP.NET Core (.NET 8) Web API
- `frontend/` - React app

## Prerequisites

- .NET SDK 8 (`dotnet --version` should show `8.x`)
- Node.js 18+ and npm
- SQL Server (SQL Express)

## Backend (ASP.NET Core API)

### 1) Configure environment variables

The backend loads configuration from a `.env` file.

- Copy `Backend/.env.example` to `Backend/.env`.

### 2) Create the database

Create a SQL Server database.

Update the DB connection string in `Backend/.env` (`ConnectionStrings__DefaultConnection`).\

### 3) Apply EF Core migrations

Run this from the `Backend/` directory.

```bash
cd Backend
dotnet ef database update
```

### 4) Run the API

From the repo root:

```bash
cd Backend
dotnet restore
dotnet run
```

- API base URL: `http://localhost:5041`
- CORS: backend allows `http://localhost:3000` by default

## Frontend (React)

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure API base URL

The frontend reads the API base URL from an environment variable.

- Copy `frontend/.env.example` to `frontend/.env`.
- Set `REACT_APP_API_BASE_URL` to your backend URL.

### 3) Start the frontend:

Inside the `frontend/` directory run:

```bash
npm start
```

App will start running at `http://localhost:3000`

## Troubleshooting

### SQL Server connection errors

- Verify the SQL Server instance name in `ConnectionStrings__DefaultConnection`.

### CORS errors in the browser

- Confirm the frontend is running at `http://localhost:3000`.
- If you changed the frontend port, update the backend CORS origin in `Backend/Program.cs`.
