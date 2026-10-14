# HerHealth — Universal Well-Being Companion

HerHealth is an AI-powered personal well-being companion designed to help women understand their everyday health through daily check-ins, personalized insights, conversational assistance, and health tracking.

The project focuses on universal well-being rather than making menstrual cycle tracking a requirement. Cycle tracking is optional, allowing the application to support users across different ages and life stages.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running Tests](#running-tests)
- [Running the Application](#running-the-application)
- [Demonstration Guide](#demonstration-guide)
- [Development Roadmap](#development-roadmap)
- [Team Contributions](#team-contributions)

## Project Overview

HerHealth follows a simple health-tracking workflow:

**Log → Understand → Act → Reflect**

Users record daily health information, review patterns and insights, receive plain-language explanations, and track changes over time.

The application is designed to make health information easier to understand while supporting privacy, user choice, and appropriate escalation of potentially urgent symptoms.

## Features

### 1. Daily Health Check-In
- Mood tracking on a 1–5 scale.
- Energy tracking on a 1–5 scale.
- Sleep duration and sleep quality.
- Stress-level tracking.
- Symptom selection and optional notes.
- Optional menstrual flow tracking.

### 2. AI Insight Engine
- Examines relationships between recorded health indicators.
- Calculates statistical correlations between selected variables.
- Presents insight cards to help users explore possible patterns.
- Provides non-prescriptive recommendations.

### 3. Conversational AI Companion
- Provides plain-language explanations of common health topics.
- Answers questions about symptoms and everyday well-being.
- Supports an empathetic, accessible conversational experience.
- Supports configured AI providers with an offline fallback.

### 4. Explain-My-Body
Provides accessible explanations of common experiences such as fatigue, brain fog, headaches, bloating, and sleep difficulties.

### 5. Health Safety Escalation
Detects selected potential red-flag symptoms and displays safety guidance rather than relying solely on routine app recommendations.

### 6. Doctor-Visit Preparation
Generates a health summary that can help users prepare for a medical appointment, including recorded trends, symptom information, and questions to discuss.

### 7. Health Timeline
Displays longitudinal health records and supports filtering to help users review changes over time.

### 8. Privacy and Security
- Pseudonymous user identifiers.
- Configurable privacy and research-consent settings.
- Health-data export functionality.
- Data deletion functionality.

### 9. Demonstration Profiles
Includes sample demographic profiles for demonstrating how the interface behaves for users at different ages and life stages.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Next.js API route handlers |
| ORM | Prisma ORM |
| Database in the current version | SQLite |
| Statistical analysis | TypeScript-based correlation logic |
| AI assistance | Configurable Anthropic Claude or Google Gemini integration |
| Testing | TypeScript test runner using `tsx` |

**Database note:** The current repository is configured for SQLite. A PostgreSQL/Supabase migration should be documented as implemented only after the migration has been completed and verified.

## Project Structure

```text
HerHealth/
├── prisma/
│   ├── dev.db
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── check-in/
│   │   │   ├── companion/
│   │   │   ├── doctor-prep/
│   │   │   ├── insights/
│   │   │   ├── privacy/
│   │   │   └── users/
│   │   ├── companion/
│   │   ├── doctor-prep/
│   │   ├── privacy/
│   │   ├── timeline/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   └── lib/
│       ├── aiCompanion.ts
│       ├── doctorPrep.ts
│       ├── insightEngine.ts
│       ├── prisma.ts
│       ├── redFlags.ts
│       ├── test-runner.ts
│       └── types.ts
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js 18 or later.
- npm.
- Git.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/nairSahasra/HerHealth.git
cd HerHealth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the provided template.

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

The template configures a local SQLite database and includes optional AI-provider environment variables.

Add valid API keys only if you intend to use the corresponding external AI service. Do not commit `.env` or expose API keys in public repositories.

### 4. Initialize the database

```bash
npm run db:push
```

### 5. Load demonstration data

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

Execute the project's automated tests using:

```bash
npm test
```

The test runner is configured in `src/lib/test-runner.ts`. Review the test output to confirm which checks pass in your local environment.

## Demonstration Guide

For a project review, consider demonstrating the following workflows:

1. **Dashboard:** Show the health dashboard and available health indicators.
2. **Daily Check-In:** Record mood, energy, sleep, stress, and symptoms.
3. **AI Insights:** Review patterns calculated from recorded health data.
4. **AI Companion:** Ask a question about a common symptom.
5. **Safety Escalation:** Demonstrate how the application responds to a configured red-flag symptom.
6. **Doctor-Visit Preparation:** Generate and preview a health summary.
7. **Health Timeline:** Review previous check-ins and filter the recorded information.
8. **Privacy Center:** Demonstrate the available consent, export, and deletion controls.

Use demonstration data for reviews and avoid exposing real users' sensitive health information.

## Development Roadmap

The following items describe planned development, not necessarily completed functionality.

### Phase 2
- Preventive-care reminders.
- Guided mental and emotional well-being activities.
- Voice-assisted check-ins.

### Phase 3
- React Native and Expo mobile application.
- Optional wearable integrations.
- Opt-in condition-specific health modules.
- Database and backend architecture improvements.

### Phase 4
- Additional optional well-being modules.
- Stronger cloud security and privacy architecture.
- Moderated peer-support capabilities.

Progress on these milestones should be updated as features are implemented and tested.

## Team Contributions

The project work can be organized into three areas:

- **Frontend and UI:** Application layout, daily check-in interface, charts, responsive styling, and doctor-visit views.
- **Backend and AI:** API routes, statistical insight generation, conversational assistance, and safety escalation.
- **Database, Testing, and Documentation:** Prisma schema, database persistence, demonstration data, privacy functionality, automated tests, and project documentation.

## Disclaimer

HerHealth is intended to support personal health awareness and preparation for healthcare conversations. It is not a substitute for professional medical advice, diagnosis, or emergency care.

## Repository

GitHub: https://github.com/nairSahasra/HerHealth
