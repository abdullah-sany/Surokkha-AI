# 🛡️ Surokkha AI

### AI-Powered Healthcare Navigation & Emergency Assistance Platform for Bangladesh

**Surokkha AI** is an intelligent healthcare assistance platform designed to help people in Bangladesh navigate healthcare services, understand health-related information, and access emergency resources more efficiently.

It combines **Generative AI, healthcare facility data, emergency services, and safety-focused AI guidance** into a unified platform.

<p align="center">

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Surokkha%20AI-red?style=for-the-badge)](https://surokkha-ai.netlify.app/)
[![GitHub](https://img.shields.io/badge/Source%20Code-GitHub-black?style=for-the-badge\&logo=github)](https://github.com/abdullah-sany/Surokkha-AI)

</p>

---

## 🎯 The Problem

Finding the right healthcare service during an urgent situation can be difficult.

People may struggle to:

* Find nearby healthcare facilities
* Identify appropriate emergency resources
* Locate ambulance services
* Understand health-related information
* Determine when a situation may require urgent professional attention
* Navigate fragmented healthcare information

For a country like Bangladesh, where healthcare resources and information can be distributed across many different sources, a simple and intelligent healthcare navigation layer can be valuable.

---

## 💡 Our Solution

**Surokkha AI** brings multiple healthcare assistance capabilities together in one platform.

The system is designed to:

* Provide AI-powered healthcare guidance
* Help users discover healthcare facilities
* Provide emergency healthcare information
* Search ambulance services
* Analyze uploaded prescriptions and extract useful information
* Identify potentially urgent situations
* Escalate users toward professional/emergency assistance when appropriate

> **Surokkha AI is an assistance and navigation system — not a replacement for doctors or emergency medical professionals.**

---

# ✨ Key Features

## 🤖 AI Specialist Guide

An AI-powered healthcare assistance interface that allows users to interact with the system using multiple input methods.

### Capabilities

* 💬 Text input
* 🎙️ Voice input
* 🖼️ Image-based input
* 🧠 Gemini AI integration
* ⚠️ Safety-oriented response classification
* 🚨 Emergency escalation guidance

The system is designed to provide general informational assistance while avoiding unsupported medical certainty.

---

## 💊 Prescription Analyzer

Users can upload prescription images for AI-assisted interpretation.

### Workflow

```text
Prescription Image
       ↓
Image Processing
       ↓
Gemini Vision / OCR
       ↓
Medicine Extraction
       ↓
Structured Information
       ↓
Safe Explanation
```

The analyzer can help users understand extracted medicine information in a simpler format.

> Prescription analysis is informational and does not replace a qualified pharmacist or physician.

---

# 🚨 Emergency & Healthcare System

Surokkha AI includes a dedicated emergency healthcare navigation system.

## 🏥 Emergency Hub

Provides access to:

* Find Hospital
* Find Ambulance
* Emergency Contacts
* Nearby Help

---

## 🏥 Healthcare Facility Search

Users can search healthcare facilities using filters such as:

* Division
* District
* Facility Type
* Ownership
* Distance / location-based sorting

The platform is designed to make healthcare facility discovery faster and easier.

---

## 🚑 Ambulance Directory

The ambulance directory provides structured ambulance information to help users discover available ambulance services.

The system is designed to support location-based healthcare and emergency navigation across Bangladesh.

---

## 📞 Emergency Contacts

Important emergency contact information can be presented through the emergency assistance interface so users can quickly identify appropriate services.

---

# 🧠 AI Safety Approach

Healthcare AI requires additional safety considerations.

Surokkha AI is designed around a **safety-first assistance model**.

The AI should:

* Provide general health information
* Highlight potential warning signs
* Encourage professional medical assistance when appropriate
* Escalate potentially urgent situations
* Avoid presenting uncertain information as medical fact

The AI should **not**:

* Diagnose diseases
* Replace doctors
* Prescribe medication
* Claim medical certainty
* Encourage users to ignore emergency symptoms

For serious or emergency symptoms, users should seek qualified medical or emergency assistance immediately.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      SUROKKHA AI     │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
      │  AI Specialist│     │ Emergency Hub │     │  Prescription │
      │               │     │               │     │    Analyzer   │
      └───────┬───────┘     └───────┬───────┘     └───────┬───────┘
              │                     │                     │
              ▼                     ▼                     ▼
        ┌───────────┐        ┌────────────┐        ┌─────────────┐
        │ Gemini AI │        │ PostgreSQL │        │ Gemini Vision│
        └───────────┘        └────────────┘        └─────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ Safety & Escalation │
                         └─────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons

### Backend

* Node.js
* Express
* TypeScript

### AI

* Google Gemini
* Gemini Vision
* AI-assisted safety classification

### Database

* PostgreSQL

### Deployment

* Netlify
* Render

---

# 📂 Project Structure

```text
Surokkha-AI/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── ...
│
├── public/
│
├── server.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

> Project structure may evolve as additional Surokkha AI modules are integrated.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/abdullah-sany/Surokkha-AI.git
```

## 2. Navigate into the project

```bash
cd Surokkha-AI
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit your real API keys to GitHub.

## 5. Start the development server

```bash
npm run dev
```

The application should then be available through the local development URL shown in your terminal.

---

# 🔐 Environment Variables

Create a `.env` file locally.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

For security:

```text
.env
.env.local
```

should never be committed to the repository.

A `.env.example` file is provided so developers can understand which variables are required without exposing secrets.

---

# 📸 Screenshots

> Product screenshots will be added here to showcase the main interfaces.

### 🏠 Main Dashboard

*Add screenshot here*

### 🤖 AI Specialist

*Add screenshot here*

### 🚨 Emergency Healthcare System

*Add screenshot here*

### 💊 Prescription Analyzer

*Add screenshot here*

### 🚑 Ambulance Directory

*Add screenshot here*

---

# 🎥 Product Demo

A short demonstration video will showcase:

```text
User
 ↓
Healthcare Question
 ↓
AI Specialist
 ↓
Safety Classification
 ↓
Healthcare / Emergency Guidance
 ↓
Professional Assistance
```

**Demo:** Coming soon

---

# 🗺️ Roadmap

## ✅ Completed

* [x] Surokkha AI core interface
* [x] AI Specialist interface
* [x] Gemini AI integration
* [x] Emergency Healthcare System
* [x] Healthcare facility search
* [x] District & division filtering
* [x] Ambulance directory
* [x] Emergency contacts
* [x] PostgreSQL healthcare data integration

## 🚧 In Progress

* [ ] Prescription Analyzer improvements
* [ ] Advanced AI safety classification
* [ ] Improved Bengali language support
* [ ] Expanded Bangladesh healthcare dataset
* [ ] Better location-based emergency assistance

## 🔮 Future Plans

* [ ] Voice-first healthcare assistant
* [ ] Mobile application
* [ ] More comprehensive healthcare facility coverage
* [ ] Real-time emergency service integrations
* [ ] Advanced healthcare analytics
* [ ] Multilingual healthcare assistance

---

# 🌐 Live Projects

### 🛡️ Surokkha AI

https://surokkha-ai.netlify.app/

### 🚨 Surokkha AI — Emergency Healthcare System

https://surokkha-ai-em.onrender.com/

### 🩸 RoktoSheba AI

https://roktosheba-ai-blood-donation.netlify.app/

RoktoSheba AI is a related healthcare initiative focused on blood donation and donor discovery.

---

# 🛡️ Privacy & Responsible AI

Surokkha AI is designed with responsible healthcare assistance in mind.

The platform aims to minimize unnecessary collection of sensitive user information and should not be considered a medical diagnosis or treatment system.

Users should verify important medical information with qualified healthcare professionals.

For emergencies, users should contact appropriate emergency services immediately.

---

# 👨‍💻 Developer

## MD Abdullah Sany

AI & Software Developer

Focused on building practical AI-powered solutions for healthcare, automation, and real-world problems.

### Projects

* 🛡️ Surokkha AI
* 🩸 RoktoSheba AI
* 🎨 BeautiArt AI
* 🐍 Python Projects

---

# 📄 License

This project is currently maintained as a personal/educational innovation project.

License information will be added as the project moves toward public open-source distribution.

---

<p align="center">

### 🛡️ Surokkha AI

**Technology for safer and more accessible healthcare navigation.**

</p>
