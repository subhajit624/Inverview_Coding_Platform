<div align="center">

<img src="https://img.shields.io/badge/CrackIt-Placement%20Prep%20Platform-6366f1?style=for-the-badge&labelColor=08080f" />

# 🧠 CrackIt

**An AI-powered competitive coding & placement preparation platform**  
Built for students who are serious about cracking placements.

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)](https://www.langchain.com/)

</div>

---

## 📌 Overview

**CrackIt** is a full-stack placement preparation platform that combines competitive coding, peer mock interviews, AI-powered resume analysis, and voice-based AI interviews — all in one place. It's designed to simulate real interview environments and give students actionable, AI-driven feedback.

---

## ✨ Features

### 🖥️ Monaco Code Editor + Live Execution
- In-browser code editor powered by **Monaco Editor** (same as VS Code)
- Supports multiple languages with syntax highlighting
- Code execution via **OnlineCompiler API**, proxied through the Express backend to handle CORS and rate limiting
- Real-time output rendering inside the platform

### 👥 Peer Mock Interview System
- Live 1-on-1 video interviews using **Jitsi Meet (JaaS — 8x8.vc)**
- No session time limits with JaaS integration
- Seamlessly embedded inside the platform — no redirects
- Structured interview rooms tied to user sessions

### 🤖 AI Voice Interview
- AI-driven mock interviewer that speaks and listens
- Uses the browser's **Web Speech API** for speech recognition (STT)
- **SpeechSynthesis API** for natural text-to-speech responses
- **Gemini** (via FastAPI backend) generates contextual follow-up questions and evaluates answers in real time
- Endpoints: `/interview/start`, `/interview/respond`, `/interview/end`

### 📄 Resume ATS Analyzer
- Upload your resume (PDF) and get an ATS compatibility score
- Powered by a **dual-backend architecture**: Express handles file routing → FastAPI runs the AI pipeline
- **Cloudinary** stores uploaded PDFs securely
- **LangGraph** orchestrates the multi-step analysis pipeline (extract → analyze → score → feedback)
- **LangChain + Gemini** power the semantic analysis of resume content against JD keywords

### 🏆 Leaderboard
- Real-time competitive leaderboard across the platform
- Built with **MongoDB aggregation pipelines** for efficient ranking
- Tracks problems solved, scores, and interview performance

### 🔐 Authentication
- Secure, production-grade auth via **Clerk**
- Supports social login, session management, and protected routes
- User data synced with MongoDB via webhooks

### ⚙️ Background Jobs
- Async task processing with **Inngest**
- Handles webhook events, scheduled tasks, and long-running AI jobs without blocking the main server

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Tailwind CSS | Styling |
| Monaco Editor | In-browser code editor |
| Web Speech API | Voice input (STT) |
| SpeechSynthesis API | Voice output (TTS) |
| Clerk (React SDK) | Authentication UI |

### Backend — Express (Node.js)
| Technology | Purpose |
|---|---|
| Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Clerk (Node SDK) | Auth verification & webhooks |
| Inngest | Background job processing |
| OnlineCompiler API | Code execution (proxied) |
| Cloudinary SDK | PDF/file storage |

### AI Backend — FastAPI (Python)
| Technology | Purpose |
|---|---|
| FastAPI | AI microservice server |
| LangChain | LLM orchestration & chains |
| LangGraph | Multi-step agentic pipelines |
| Google Gemini | Core LLM (text generation) |
| Cloudinary | Resume PDF retrieval |

### Infrastructure & Services
| Service | Purpose |
|---|---|
| Jitsi JaaS (8x8.vc) | Video calling (no time limit) |
| Cloudinary | File storage (resumes) |
| MongoDB Atlas | Cloud database |
| Clerk | Auth & user management |
| Inngest | Event-driven background jobs |

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────┐
│                   React Frontend                │
│     Monaco Editor │ Jitsi │ Voice Interview     │
└────────────────┬───────────────────────────────┘
                 │ REST API
┌────────────────▼───────────────────────────────┐
│             Express.js Backend                  │
│   Auth (Clerk) │ Inngest Jobs │ Code Proxy      │
│   MongoDB  │  Cloudinary Upload │ Leaderboard   │
└────────────────┬───────────────────────────────┘
                 │ HTTP (AI tasks)
┌────────────────▼───────────────────────────────┐
│            FastAPI AI Backend                   │
│   LangGraph Pipeline │ LangChain │ Gemini       │
│   /interview/* │ /resume/analyze                │
└────────────────────────────────────────────────┘
```

---

## 👨‍💻 Author

**Subhajit Ghosh**  
B.Tech — Information Technology  
Kalyani Government Engineering College (KGEC)

---

<div align="center">

Made with 💜 for placement season

</div>
