# Fidenz Full Stack Assignment - Weather Analytics Application

A professional, secure, and responsive weather analytics dashboard that calculates a custom **Comfort Index** for 10 global cities.

## 🚀 Live Features
- **Custom Logic:** Proprietary algorithm to calculate weather comfort.
- **Security:** Fully integrated Auth0 with Multi-Factor Authentication (MFA).
- **Performance:** Server-side caching (5-minute TTL) to reduce API latency.
- **Interactive UI:** Smooth animations (Framer Motion) and Data Visualization (Recharts).
- **Themes:** Fully functional Dark Mode and Light Mode support.
- **Robustness:** Unit tests for core algorithm logic using Jest.

---

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Recharts, Auth0 SDK.
- **Backend:** Node.js, Express.js, Axios, Jest (Testing).
- **API:** OpenWeatherMap API.
- 
---

## 🧠 Design: Comfort Index Algorithm
My custom algorithm produces a score from **0 to 100** based on three key parameters.

### The Formula:
`Score = (TempScore * 0.5) + (HumidityScore * 0.3) + (WindScore * 0.2)`

### Reasoning & Variable Weights:
1.  **Temperature (50%):** Given the highest weight because it is the most significant factor in human comfort. The baseline is set at **22°C** (Ideal). Points are deducted as the temperature deviates from this ideal.
2.  **Humidity (30%):** High humidity makes heat feel more intense, while very low humidity causes dryness. **45%** is treated as the ideal humidity.
3.  **Wind Speed (20%):** Wind can cool down a hot day but make a cold day unbearable. Low wind speeds are generally preferred for outdoor comfort.

---

## ⚖️ Trade-offs Considered
1.  **In-Memory vs. Redis:** For this assignment, I used in-memory caching for simplicity and speed. In a high-traffic production environment, I would opt for **Redis** to ensure cache persistence across server restarts.
2.  **State Management:** I used React's `useState` and `useMemo` for data handling. For a larger app with more complex global states, I would transition to **Redux Toolkit** or **Zustand**.

---

## 💾 Caching Strategy
I implemented a **Server-Side In-Memory Cache** with a **5-minute TTL (Time To Live)**.
- **Raw API data** is cached to prevent redundant calls to the OpenWeatherMap API.
- **Processed data** (Scores and Ranks) is also cached to ensure the frontend receives data instantly.
- **Debug Endpoint:** Visit `/api/cache-status` to see if the server returned a `HIT` or a `MISS`.

---

## ⚠️ Known Limitations & Technical Challenges

### 1. Auth0 MFA Enrollment Flow
- **Limitation:** By default, Auth0's free tier prioritizes "Strong Factors" (like Authenticator Apps/QR Codes), often making it difficult to trigger a direct Email MFA challenge as required by the assignment.
- **My Solution:** I resolved this by enabling the "Customize MFA Factors using Actions" toggle under Security > Multi-factor Auth > Additional Settings. This allowed me to override the default enrollment behavior.
- **Technical Implementation:** I authored a custom Auth0 Post-Login Action using the api.authentication.challengeWith method. By programmatically directing the authentication flow to challenge the user via Email, I ensured that verified users are directly prompted for an Email OTP code. This implementation successfully fulfills the assignment's security requirement for Email-based Multi-Factor Authentication.

- 
### 2. Static City Management
- **Limitation:** The list of 10 cities is currently managed via a static `cities.json` file.
- **Reasoning:** I followed the specific instructions in the assignment PDF. 
- **Production Improvement:** In a real-world scenario, this would be moved to a database (like MongoDB or PostgreSQL) with an Admin CRUD interface to manage cities dynamically.

### 3. Weather Trend Visualization (Graphs)
- **Limitation:** The "7-Day Trend" graphs in the dashboard currently use simulated data based on the current temperature.
- **Reasoning:** The OpenWeatherMap Free Tier API only provides "Current Weather." Access to historical or forecast data for trend mapping requires a paid subscription.
- **Implementation:** I generated a variation trend based on the current temperature to demonstrate my proficiency in data visualization using **Recharts** and frontend integration.

### 4. In-Memory Caching
- **Limitation:** The cache is stored in the server's RAM.
- **Result:** If the backend server restarts, the cache is cleared, and the next request will result in a `MISS`.
- **Production Improvement:** I would implement **Redis** as a dedicated caching layer for persistence and better scalability across multiple server instances.

---

## 🔒 Security & MFA
- **Restricted Access:** Public signups are disabled. Only whitelisted users can log in.
- **MFA Flow:** Implemented **MFA via Email verification** using Auth0 Actions.
- **Test Credentials:**
  - **User:** `careers@fidenz.com`
  - **Password:** `Pass#fidenz`

---

## ⚙️ Setup Instructions

### Environment Variables (.env)
**IMPORTANT:** For security reasons, the `.env` files have not been pushed to this repository. I have shared the required `.env` values (Server Port, OpenWeather API Key, and Auth0 Credentials) via the submission email/private channel. 

To run the project, you must create a `.env` file in the root of the `/backend` folder and another in the root of the `/frontend` folder using the provided credentials.

### 1. Backend Setup
The backend runs on **Node.js** and handles API orchestration and caching.
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server (runs on http://localhost:5001)
npm run dev

# Run unit tests for the algorithm
npm test

### 2. Frontend Setup
The frontend is built with **React** and **Vite**, utilizing **Tailwind CSS** for styling and **Framer Motion** for animations.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend application (runs on http://localhost:5173)
npm run dev

---

## 👨‍💻 Developer Information

Thank you for taking the time to review my submission. I would be happy to discuss any aspect of the technical implementation or provide further assistance with the environment setup if required. 

Please feel free to reach out to me through any of the following channels:

- **Name:** Savindu Weerarathna
- **Email:** [savinduweerarathna@gmail.com](mailto:savinduweerarathna@gmail.com)
- **Phone:** [+94 77 065 7948](tel:+94770657948)
- **LinkedIn:** [linkedin.com/in/savinduweerarathna](https://linkedin.com/in/savinduweerarathna)
- **GitHub:** [github.com/SavinduS](https://github.com/SavinduS)

---
*I look forward to the opportunity to discuss this project further with your team.*
