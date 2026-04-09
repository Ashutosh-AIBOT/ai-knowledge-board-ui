# 🌐 AI Knowledge Board (UI Interface)

Premium Atmospheric Discovery Hub for academic literature and literature synthesis. This repository provides a high-fidelity interaction layer for the Research Discovery Hub.

## 🌟 Interactive Features
- **Atmospheric UI**: A high-end dark-mode interface utilizing **Glassmorphism**, **Discovery Fog** animations, and a structured search hub.
- **Glassmorphic Wiki Cards**: Synthesis results are displayed as interactive, premium cards for deep literature exploration.
- **Dual-Source Discovery**: Search real-time research papers across **arXiv** and **Semantic Scholar** with citation tracking.
- **Talk-to-PDF**: Inline synthesis allows users to convert any discovered academic paper into an atomic knowledge map.
- **Sequential Context**: Research papers are linked to specific conversation turns, maintaining a clear lineage of your discovery process.

## 🛠️ Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Premium Modern Design System)
- **HTTP Client**: Axios (with centralized service architecture)
- **Linting**: ESLint (Flat Config)

## 🚀 Deployment (Vercel / Hugging Face Static)
This UI is optimized for static hosting or Docker-based frontend spaces.
1. **Exposed Port**: `7860` (for Hugging Face via the included Nginx Dockerfile).
2. **Required Environment Variables**:
   - `VITE_API_BASE_URL`: The URL of your running **Research Core (Backend)** Space.

## 📡 Core Workflow
1. **Interact**: Ask questions or search global research databases.
2. **Discover**: Scroll through real-time results from arXiv and Scholar.
3. **Synthesize**: Click "Talk with PDF" to trigger the backend synthesis engine.
4. **Learn**: Deep-dive into specific "Wiki Nodes" for atomic knowledge acquisition.

## 🔗 Credits
- **Architect**: [Ashutosh]
- **Design Philosophy**: Minimalist AI interface concept inspired by Andrej Karpathy.
