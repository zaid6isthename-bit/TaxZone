# TaxZone

Welcome to **TaxZone** — a premium B2B SaaS platform tailored for modern businesses, individuals, and Chartered Accountants (CAs). Designed with the visual elegance of Notion, Linear, and Razorpay, TaxZone simplifies complex taxation, active filings, and document management.

This repository contains:
1. **`client-app/`**: A Flutter mobile application intended for client onboarding, real-time filing trackers, timeline progression, notification centers, and secure multi-format document uploads.
2. **`web-dashboard/`**: A premium, high-performance Next.js Web Application containing both the Employee Dashboard and the Admin Control Center.

---

## 🚀 Key Features

### Flutter Client Mobile App
*   **Onboarding Flow**: Splash screens with seamless animations, secure OTP credentials, and first-time set password setups.
*   **Bottom Navigation Tabs**: Home, Documents, Filings, Notifications, and Profile.
*   **Timeline Tracker**: Step-by-step audit trails of tax filing progress.
*   **Secure Document Uploads**: Integrated local file selection (PDF & image support) with custom validation and real-time simulator previewing.

### Next.js Employee & Admin Dashboard
*   **Notion-esque Workspace & Layout**: Clean, collapsible grid-based sidebar, and light/dark theme variables.
*   **Clients & Profile Center**: Complete search logs, filtered category structures, and full active file sheets.
*   **Admin Panel & Analytics**: Advanced graphs detailing employee workloads, client distributions, monthly filings, and bulk uploads.
*   **Interactive Simulation System**: Experience live, interactive actions directly inside the web workspace to preview tax workflows!

---

## 🛠️ Tech Stack & Structure

### Client App (Flutter)
- **State Management**: Riverpod
- **Routing**: GoRouter
- **Caching**: Hive (Offline caching)
- **Local Authentication**: Biometrics (LocalAuth)

### Web Dashboard (Next.js)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Custom CSS variables
- **Icons**: Lucide Icons
- **Visualizations**: Responsive charts

---

## 🏃 Getting Started

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   Flutter SDK (for compilation of the mobile app)

### Next.js Web Dashboard
1. Navigate into the web dashboard directory:
   ```bash
   cd web-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Access the web portal at `http://localhost:3000`.

### Flutter Mobile App
1. Navigate into the client app folder:
   ```bash
   cd client-app
   ```
2. Fetch dependencies:
   ```bash
   flutter pub get
   ```
3. Launch on a connected emulator or physical device:
   ```bash
   flutter run
   ```
