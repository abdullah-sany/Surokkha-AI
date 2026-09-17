<div align="center">

# 🛡️ SUROKKHA AI

### **AI-Powered Healthcare Navigation & Emergency Assistance Platform for Bangladesh**

**Intelligent healthcare guidance • Emergency navigation • Healthcare discovery • Responsible AI**

<br>

<a href="https://surokkha-ai.netlify.app/">
  <img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-SUROKKHA%20AI-E63946?style=for-the-badge" alt="Live Demo">
</a>
<a href="https://github.com/abdullah-sany/Surokkha-AI">
  <img src="https://img.shields.io/badge/💻%20SOURCE-GITHUB-111111?style=for-the-badge&logo=github" alt="GitHub">
</a>

<br><br>

<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat-square&logo=google&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">

<br><br>

**🇧🇩 Built for Bangladesh • 🤖 Powered by AI • 🛡️ Designed with Safety in Mind**

</div>

---

## 🌟 What is Surokkha AI?

**Surokkha AI** is a healthcare technology platform designed to make healthcare information and emergency resources easier to discover and understand.

Instead of forcing users to navigate multiple disconnected services, Surokkha AI brings together:

> 🤖 **AI Healthcare Assistance**
> 🏥 **Healthcare Facility Discovery**
> 🚑 **Emergency & Ambulance Navigation**
> 💊 **Prescription Understanding**
> 🚨 **Safety-Oriented Escalation**

The platform combines **Generative AI + structured healthcare data + emergency navigation** into a unified experience.

---

# 🎯 The Problem

Healthcare information can be difficult to navigate—especially during stressful or urgent situations.

Users may need to quickly answer questions such as:

* Where is the nearest suitable healthcare facility?
* What emergency resources are available?
* How can I find an ambulance?
* What does this prescription say?
* Is a situation potentially urgent?
* When should I seek professional medical help?

Surokkha AI is designed to provide a **single, accessible interface for healthcare navigation and AI-assisted information**.

---

# 💡 Our Approach

```text
                    USER
                     │
                     ▼
            ┌─────────────────┐
            │   SUROKKHA AI   │
            └────────┬────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
   🤖 AI Guide   🚨 Emergency   💊 Prescription
       │             │             │
       ▼             ▼             ▼
   Gemini AI    Healthcare DB   Vision / OCR
       │             │             │
       └─────────────┼─────────────┘
                     ▼
             🛡️ Safety Layer
                     │
                     ▼
          Professional Assistance
```

---

# ✨ Core Features

<table>
<tr>
<td width="50%">

## 🤖 AI Specialist

AI-assisted healthcare information through a conversational interface.

**Features**

* 💬 Text input
* 🎙️ Voice input
* 🖼️ Image input
* 🧠 Gemini AI
* ⚠️ Safety classification
* 🚨 Emergency escalation

</td>

<td width="50%">

## 🚨 Emergency Hub

Quick access to healthcare and emergency resources.

**Features**

* 🏥 Find hospitals
* 🚑 Find ambulances
* 📞 Emergency contacts
* 📍 Nearby help
* 🔎 Facility filtering
* 🗺️ Healthcare navigation

</td>
</tr>

<tr>
<td width="50%">

## 💊 Prescription Analyzer

AI-assisted extraction and explanation of prescription information.

**Workflow**

`Image → Vision/OCR → Medicine Extraction → Explanation`

Designed to help users understand prescription information more clearly.

</td>

<td width="50%">

## 🏥 Healthcare Directory

Structured healthcare facility discovery across Bangladesh.

**Filters**

* Division
* District
* Facility type
* Ownership
* Distance / location

</td>
</tr>
</table>

---

# 🛡️ Responsible AI & Safety

Healthcare AI requires a different level of caution.

Surokkha AI follows a **safety-first assistance approach**.

### The system is designed to:

* Provide general healthcare information
* Highlight potential warning signs
* Encourage professional medical assistance
* Identify potentially urgent situations
* Provide emergency escalation guidance

### The system is NOT designed to:

* ❌ Diagnose diseases
* ❌ Replace doctors
* ❌ Prescribe medication
* ❌ Claim medical certainty
* ❌ Tell users to ignore emergency symptoms

> **Surokkha AI is an informational and navigation tool, not a replacement for qualified medical professionals.**

For serious or emergency symptoms, users should seek appropriate professional or emergency medical assistance immediately.

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         SUROKKHA AI                          │
└───────────────────────────────┬──────────────────────────────┘
                                │
                         React Frontend
                                │
               ┌────────────────┼────────────────┐
               │                │                │
               ▼                ▼                ▼
        AI Specialist     Emergency Hub    Prescription
               │                │                │
               │                │                │
               ▼                ▼                ▼
         Gemini API        Backend API      Gemini Vision
               │                │                │
               │                ▼                │
               │           PostgreSQL            │
               │                │                │
               └────────────────┼────────────────┘
                                ▼
                       Safety / Escalation
                                │
                                ▼
                     Professional Assistance
```

---

# 🧠 AI Architecture

```text
User Input
    │
    ├── Text
    ├── Voice
    └── Image
         │
         ▼
   Input Processing
         │
         ▼
     Gemini AI
         │
         ▼
 Safety Classification
         │
    ┌────┴────┐
    │         │
 Normal    Potentially
 Request    Urgent
    │         │
    ▼         ▼
 Guidance   Escalation
    │         │
    └────┬────┘
         ▼
 Professional Care
```

---

# 🏥 Emergency Healthcare Architecture

```text
                    Emergency Hub
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
    Hospitals         Ambulances       Emergency
                                           Contacts
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                    Search & Filter
                         │
                         ▼
                  Healthcare Results
```

---

# 🗄️ Data Architecture

Surokkha AI uses **PostgreSQL** for structured healthcare and emergency data.

### Core entities

```text
Healthcare Facilities
        │
        ├── Division
        ├── District
        ├── Upazila
        ├── Facility Type
        ├── Ownership
        └── Facility Information

Ambulances
        │
        ├── Provider
        ├── Location
        └── Contact Information

Emergency Contacts
        │
        ├── Service
        └── Contact Information
```

The database architecture is designed so additional healthcare data sources can be integrated as the platform grows.

---

# 🖥️ Product Showcase

> Replace the image paths below with your actual screenshots.

## 🏠 Main Experience

<p align="center">
  <img src="docs/screenshots/home.png" width="90%" alt="Surokkha AI Home">
</p>

---

## 🤖 AI Specialist

<p align="center">
  <img src="docs/screenshots/ai-specialist.png" width="90%" alt="AI Specialist">
</p>

---

## 🚨 Emergency Healthcare System

<p align="center">
  <img src="docs/screenshots/emergency.png" width="90%" alt="Emergency Healthcare System">
</p>

---

## 💊 Prescription Analyzer

<p align="center">
  <img src="docs/screenshots/prescription.png" width="90%" alt="Prescription Analyzer">
</p>

---

## 🚑 Ambulance Directory

<p align="center">
  <img src="docs/screenshots/ambulance.png" width="90%" alt="Ambulance Directory">
</p>

---

# 🎥 Product Demonstration

### See Surokkha AI in action

**Demo Video:** Coming soon

Recommended demo flow:

```text
01 → Open Surokkha AI
02 → Ask a healthcare question
03 → AI processes the request
04 → Safety classification
05 → Healthcare guidance
06 → Emergency escalation when appropriate
07 → Find healthcare facilities / ambulance
```

---

# 🛠️ Technology Stack

| Layer               | Technology          |
| ------------------- | ------------------- |
| Frontend            | React + TypeScript  |
| Build Tool          | Vite                |
| Styling             | Tailwind CSS        |
| Icons               | Lucide React        |
| Backend             | Node.js + Express   |
| AI                  | Google Gemini       |
| Vision              | Gemini Vision / OCR |
| Database            | PostgreSQL          |
| Frontend Deployment | Netlify             |
| Backend Deployment  | Render              |

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
│
├── docs/
│   └── screenshots/
│
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clone

```bash
git clone https://github.com/abdullah-sany/Surokkha-AI.git
```

## 2. Enter the project

```bash
cd Surokkha-AI
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create a local `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit real API keys to GitHub.

## 5. Start development

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

---

# 🔐 Environment Variables

Create:

```text
.env
```

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

For public repositories:

```text
.env
.env.local
```

must remain excluded through `.gitignore`.

A safe `.env.example` should contain placeholders only:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

# 🌐 Live Deployments

<div align="center">

### 🛡️ Surokkha AI

**Main Platform**

https://surokkha-ai.netlify.app/

<br>

### 🚨 Surokkha AI — Emergency System

**Emergency Healthcare Module**

https://surokkha-ai-em.onrender.com/

<br>

### 🩸 RoktoSheba AI

**Blood Donation Platform**

https://roktosheba-ai-blood-donation.netlify.app/

</div>

---

# 🗺️ Roadmap

### ✅ Implemented

* [x] Surokkha AI core platform
* [x] AI Specialist interface
* [x] Gemini AI integration
* [x] Emergency Healthcare System
* [x] Healthcare facility search
* [x] Division & district filtering
* [x] Ambulance directory
* [x] Emergency contacts
* [x] PostgreSQL healthcare database
* [x] Production deployments

### 🚧 Improving

* [ ] Prescription Analyzer refinement
* [ ] Expanded healthcare dataset
* [ ] Improved Bengali language experience
* [ ] Advanced safety classification
* [ ] Improved location-based discovery

### 🔮 Future

* [ ] Voice-first healthcare assistant
* [ ] Mobile application
* [ ] Real-time emergency service integrations
* [ ] Larger national healthcare database
* [ ] Multilingual healthcare assistance
* [ ] Healthcare analytics
* [ ] Offline / low-connectivity support

---

# 📊 Vision

Surokkha AI aims to evolve from a healthcare information interface into a broader **digital healthcare navigation ecosystem for Bangladesh**.

The long-term vision includes:

```text
                 SUROKKHA ECOSYSTEM
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   AI Healthcare    Emergency Care   Healthcare
     Assistant       Navigation       Discovery
        │                │                │
        ├────────────────┼────────────────┤
                         │
                         ▼
                Accessible Healthcare
```

---

# 🌱 Why It Matters

Technology alone cannot solve every healthcare challenge.

But better access to information, faster navigation, responsible AI assistance, and easier discovery of emergency resources can help reduce friction between **people and healthcare services**.

Surokkha AI is an attempt to build that bridge.

---

# 👨‍💻 Developer

<div align="center">

## MD Abdullah Sany

**AI & Software Developer**

Building practical AI-powered solutions for real-world problems.

<br>

<a href="https://github.com/abdullah-sany">
  <img src="https://img.shields.io/badge/GitHub-abdullah--sany-181717?style=for-the-badge&logo=github">
</a>

</div>

---

# 📄 License

This project is currently maintained as a personal/educational innovation project.

License information will be added according to the project's distribution and open-source requirements.

---

<div align="center">

# 🛡️ Surokkha AI

### **Technology for safer and more accessible healthcare navigation.**

<br>

**🇧🇩 Made for Bangladesh**

</div>
