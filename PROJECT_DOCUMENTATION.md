# Sonic Hub (SoundWave) - Project Documentation
**Prepared for Viva & Evaluation**

## 1. Project Overview
Sonic Hub is a full-stack, AI-powered e-commerce platform specializing in premium electronics. It integrates a custom-built AI chatbot, secure authentication, real-time payment processing, and automated email notifications, providing a modern, seamless user experience.

---

## 2. Technology Stack & Why It Was Used (Viva Prep)

### **Frontend**
*   **React.js (via Vite):** Chosen for its component-based architecture which makes UI scalable. Vite was chosen over Create React App because its Hot Module Replacement (HMR) and build times are significantly faster.
*   **TailwindCSS & Shadcn UI:** Provides utility-first styling and accessible, pre-built components for a highly polished, modern glassmorphic design without writing massive CSS files.
*   **Zustand:** Used for state management (like the Shopping Cart). Chosen over Redux because it is much lighter, has zero boilerplate, and is easier to implement.

### **Backend**
*   **Node.js & Express.js:** A non-blocking, event-driven runtime environment perfect for handling multiple API requests simultaneously.
*   **MongoDB Atlas (via Mongoose):** A NoSQL cloud database. Chosen because its JSON-like document structure pairs perfectly with JavaScript/Node.js, allowing fast iterations on data models like Users and Orders.

### **Third-Party Integrations (Crucial for Viva)**
*   **Razorpay:** Integrated for secure, real-time payment processing. **Why?** It is the industry standard in India, providing seamless checkout experiences and robust webhook/signature verification to prevent fraud.
*   **Resend:** Used for transactional emails (Welcome emails, Order confirmations, Payment receipts). **Why?** It's a modern, developer-friendly email API built for React/Node ecosystems, ensuring high deliverability.
*   **Sentry:** An application performance monitoring and error tracking tool. **Why?** It automatically captures frontend crashes and backend exceptions, allowing developers to trace errors to the exact line of code without manually digging through server logs.

---

## 3. Core System Architectures & Flows

### **A. Secure Authentication Flow**
1.  **Registration:** User submits details -> Backend hashes password using `bcrypt` (for security against database breaches) -> Saves to MongoDB -> Generates a JSON Web Token (JWT) -> Triggers **Resend** to send a "Welcome Email".
2.  **Login:** Validates password -> Returns JWT -> Frontend stores JWT in local storage and attaches it to the `x-auth-token` header for all protected routes (like Checkout and Orders).

### **B. Payment & Checkout Flow (Razorpay)**
This is a secure, 3-step verification process:
1.  **Order Creation:** When a user clicks "Pay", the frontend calls `POST /api/orders`. The backend creates an Order document in MongoDB (status: "created") and simultaneously creates a Razorpay Order via their API.
2.  **Client Checkout:** The backend returns the `razorpayOrderId`. The frontend uses the Razorpay SDK to open the payment gateway popup.
3.  **Server Verification:** After successful payment on the popup, Razorpay returns a `razorpay_payment_id` and a `razorpay_signature`. The frontend sends these to `PUT /api/orders/:id/pay`. The backend **cryptographically verifies the signature** using the Razorpay Secret Key. If valid, the order is marked as "paid" in MongoDB, and **Resend** fires a "Payment Successful" email.

### **C. AI Chatbot Architecture**
Instead of relying on expensive external APIs like OpenAI, the project uses a custom, lightweight algorithmic engine:
1.  **Normalization & Intent Classification:** Cleans user input and determines if the user wants a price check, comparison, or general FAQ.
2.  **Fuzzy Searching (Levenshtein Distance):** Allows the bot to understand typos.
3.  **Reasoning Engine:** Constructs a dynamic text response and attaches relevant product data directly from the catalog.

---

## 4. Security Measures Implemented
If the examiner asks about security, mention these:
*   **Environment Variables (`.env`):** No API keys (Razorpay, Resend, JWT Secret) are hardcoded. They are injected at runtime.
*   **Password Hashing:** `bcryptjs` ensures passwords are never stored in plain text.
*   **HMAC-SHA256 Signature Verification:** Prevents users from faking successful payments.
*   **Helmet.js & Rate Limiting:** Backend middleware protects against common web vulnerabilities (like XSS) and prevents brute-force login attacks or DDoS attacks on the API.

---

## 5. Recent Refactoring & Code Cleanup
*   Migrated from local JSON flat-files to a robust **MongoDB Atlas** database for scalability.
*   Removed unnecessary Cloudflare Worker (`backend-worker`), unused PlanetScale/Drizzle configurations, and orphaned frontend email scripts to ensure a clean, unified MVC architecture strictly between the React Frontend and Express Backend.
*   Fixed the payment flow to properly record cart items into the database *before* initializing the payment gateway.
