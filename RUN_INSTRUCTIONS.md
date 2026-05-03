# How to Run Sonic Hub

This project consists of a **Vite + React** frontend and an **Express + MongoDB** backend. Follow these steps to get everything running locally.

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** (comes with Node.js)
- **MongoDB Atlas** (The connection string is already provided in the `.env` file)

---

## 1. Install Dependencies

You need to install dependencies for both the frontend and the backend.

### Frontend
Open a terminal in the root directory and run:
```bash
npm install
```

### Backend
Open a terminal in the `backend` directory and run:
```bash
cd backend
npm install
```

---

## 2. Environment Variables

Check the `.env` files to ensure they are configured correctly.

- **Root `.env`**: Contains frontend API URL and Razorpay keys.
- **Backend `.env`**: Contains Database URI, JWT secret, and API keys.

> [!NOTE]
> The current `backend/.env` already contains a working MongoDB Atlas connection string.

---

## 3. Start the Servers

You need to run both the backend and frontend simultaneously.

### Start the Backend
In the `backend` directory, run:
```bash
node index.cjs
```
*You should see:* `✅ Application running correctly on port 5000` and `✅ MongoDB Atlas connected successfully`.

### Start the Frontend
In the root directory, run:
```bash
npm run dev
```
*You should see:* `➜  Local:   http://localhost:8080/`

---

## 4. Access the Application
Open your browser and go to:
[http://localhost:8080/](http://localhost:8080/)

---

## Troubleshooting
- **Port Conflicts**: If port 8080 or 5000 is already in use, you can change them in `vite.config.ts` (for frontend) or `backend/.env` (for backend).
- **MongoDB Connection**: If the backend fails to connect, ensure your IP address is whitelisted in MongoDB Atlas or check your internet connection.
