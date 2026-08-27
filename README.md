# 🌱 AI-Powered Agriculture Crop Advisory Assistant

A production-grade, secure, and explainable agricultural crop advisor that provides structured crop recommendation statistics to farmers using environmental metrics (soil pH, location, water availability, season, and rainfall) and Google Gemini AI.

---

## 🛠️ Project Structure

The project is structured as a full-stack monorepo:

```text
agriculture-crop-advisor/
├── client/          # React + Vite (TypeScript + Tailwind CSS) client-side application
├── server/          # Node + Express (TypeScript + Zod) secure server-side API
├── supabase/        # Database migrations (PostgreSQL table schemas and RLS policies)
└── package.json     # Root package manager for unified scripts
```

---

## 🚀 Setup Instructions

### Prerequisite Checklist
*   **Node.js**: Version 18+ (tested on Node v24.18.0)
*   **Supabase Account**: A project to run SQL migrations and configure Supabase Auth (Email/Password authentication provider).
*   **Google Gemini API Key**: API key to perform structural generative inference queries.

---

### Step 1: Set Up Database & Authentication
1.  Navigate to your **Supabase Dashboard** -> **SQL Editor**.
2.  Open the migration script located in `supabase/migrations/001_create_advisories.sql`.
3.  Copy and run the contents in your Supabase SQL editor to create the `advisories` table, indexes, timestamp update triggers, and Row Level Security (RLS) policies.
4.  Enable the **Email / Password** provider in your Supabase project under **Authentication** -> **Providers**.

---

### Step 2: Configure Environment Variables

#### Backend Server Configurations
Create a `.env` file in the `server` directory (`server/.env`) with the following variables:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend Client Configurations
Create a `.env` file in the `client` directory (`client/.env`) with the following variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies
Run the unified installation script from the **root folder**:
```bash
npm run install:all
```
This will automatically execute `npm install` inside both `client/` and `server/` subfolders.

---

### Step 4: Run the Applications

You will need to open two terminals to run the development servers concurrently:

#### Terminal 1: Launch Backend API Server
```bash
npm run dev:server
```
This will start the Express server on `http://localhost:5000`.

#### Terminal 2: Launch Frontend Client
```bash
npm run dev:client
```
This will start the Vite React development server on `http://localhost:5173`. Open this URL in your web browser.

---

## 🔒 Security Architectures
1.  **Row Level Security (RLS)**: Enforced at the database level. Authenticated users can insert, select, update, or delete only their own advisory records (`auth.uid() = user_id`).
2.  **Bearer JWT Authentication**: The client retrieves access tokens from Supabase Auth and forwards them in the `Authorization: Bearer <token>` header to the Node API. The API verifies the JWT using Supabase Auth endpoints before processing any database or AI generation task.
3.  **Encapsulated Secrets**: The `GEMINI_API_KEY` is kept entirely on the server-side, preventing reverse-engineering leaks.
4.  **CORS Restrictions**: Cross-Origin Resource Sharing is configured to restrict traffic to the specified frontend client URL.
5.  **Strict Endpoints Rate Limiting**: The AI advisory generation endpoint `/api/advisories` features strict rate limits to prevent billing abuse and denial of service.

---

## 🧪 Verification and API Testing

### Health Check Endpoint
To verify the server API is active, run:
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "success": true,
  "message": "Agriculture Advisory API is running"
}
```

### Try Accessing Protected Routes Without JWT
```bash
curl -X GET http://localhost:5000/api/advisories
```
Response:
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

---

## 📜 Agricultural Disclaimer
The AI Crop Advisory Assistant generates recommendations using Google Gemini for informational guidance only. It is not a replacement for professional agronomists, soil testing facilities, or localized extension programs. Always perform verification checks with physical experts prior to starting any cultivation season.
