# Healthcare Translation App

A web-based healthcare translation application built with **Next.js**, **Google Generative AI (Gemini)**, and **Vercel**.  
This app is designed to translate and improve live or batch transcripts, making it easier for healthcare professionals to communicate across language barriers.

<img width="1920" height="846" alt="image" src="https://github.com/user-attachments/assets/7135a5ec-fa00-4a0e-8692-1d3ab95e9fc2" />

---

## ✨ Features
- **Real-time Transcript Translation** – Translates speech or text into a target language.
- **Transcript Improvement** – Uses AI to correct grammar, spelling, and readability before translation.
- **Delay Before Translation** – Prevents immediate translation for long sentences by adding a configurable delay.
- **Modern UI** – Minimalist and responsive design suitable for healthcare environments.
- **Deployment Ready** – Optimized for Vercel hosting.

---

## 📦 Tech Stack
- **Frontend:** Next.js (React framework)
- **Backend API:** Next.js API Routes
- **AI Model:** Google Generative AI (Gemini)
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

---

## 🛠 Prerequisites
Before running the project locally, make sure you have:
- **Node.js** (>= 18.x)
- **npm** or **yarn**
- **Google Generative AI API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- **GitHub account** (for version control)
- **Vercel account** (for deployment)

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/your-username/healthcare-translation-app.git
cd healthcare-translation-app

---

### 2️⃣ Install Dependencies

npm install
or
yarn install

---

### 3️⃣ Configure Environment Variables

Create a .env.local file in the root folder and add:

env
GOOGLE_API_KEY=your_google_generative_ai_api_key

---

### 4️⃣ Run Locally

npm run dev
Then open http://localhost:3000 in your browser.

---

## 📖 User Guide

### 1️⃣ Using the Application
1. **Select Languages**
   - Choose the **source language** (language you speak/write).
   - Choose the **target language** (language to translate into).

2. **Speech-to-Text**
   - Click the **microphone button** to start recording.
   - Speak clearly and complete your sentence before pausing.
   - The app will **delay translation** slightly to ensure it captures the entire sentence.

3. **Viewing Results**
   - The corrected transcript will be displayed first.
   - The final translated sentence will appear below it.

---

### 2️⃣ Best Practices for Accurate Translation
- Use **full and clear sentences** for better accuracy.
- Avoid slang or highly informal language in medical contexts.
- If using speech mode:
  - Speak at a moderate pace.
  - Pause slightly between sentences.
  - Avoid background noise.

---
