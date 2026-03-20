# 🔍 Fake News Detector

<div align="center">

**An AI-powered web application that instantly verifies news headlines for authenticity using Google's Gemini AI with real-time web grounding.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

- **🤖 AI-Powered Fact Checking** — Uses Google Gemini AI to analyze headlines against real-world information
- **🌐 Real-Time Web Grounding** — Searches the live web to find and cite credible sources during verification
- **⚡ Instant Results** — Get a verdict in under 1 second with a detailed summary
- **📊 Three-State Verdict System:**
  - ✅ **TRUE** — Verified with source name, summary, and publication date
  - ❌ **FAKE / MISINFORMATION** — Flagged as false or misleading
  - ⚠️ **NOT FOUND / LOW CONFIDENCE** — Insufficient data to verify
- **🔗 Source Links** — Displays clickable grounding sources used during analysis
- **📰 Sample Articles** — Built-in real and fake article examples to explore the tool
- **📱 Fully Responsive** — Works seamlessly on desktop, tablet, and mobile

---

## 🖥️ Demo

| Input a Headline | Get an Instant AI Verdict |
|:---:|:---:|
| Paste any news headline and select the year | Receive a TRUE / FAKE / NOT FOUND result with sources |

Sample articles are included in the app to help you explore the detector right away.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript 5.8** | Type safety |
| **Vite 6** | Build tool & dev server |
| **Google Gemini AI** (`@google/genai`) | AI fact-checking engine |
| **Tailwind CSS** | Utility-first styling |

---

## 📁 Project Structure

```
FakeNews/
├── components/
│   ├── Header.tsx          # Hero section with stats (95% accuracy, <1s response)
│   ├── HowItWorks.tsx      # Feature overview section
│   ├── VerificationForm.tsx # Headline input & year selector
│   ├── ResultCard.tsx      # Verdict display with sources
│   ├── SampleArticles.tsx  # Preloaded real/fake article demos
│   ├── Footer.tsx          # App footer
│   └── icons/              # SVG icon components
├── services/
│   └── geminiService.ts    # Gemini API integration & prompt engineering
├── types.ts                # TypeScript interfaces (VerificationResult, GroundingChunk)
├── App.tsx                 # Root component & state management
├── index.tsx               # React entry point
└── index.html              # HTML shell
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A valid **Google Gemini API key** — [Get one free at Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fake-news-detector.git
   cd fake-news-detector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**

   Create a `.env.local` file in the root of the project:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in your browser**
   ```
   http://localhost:5173
   ```

---

## ⚙️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |

> **Note:** Never commit your `.env.local` file to version control. It is already included in `.gitignore`.

---

## 🧠 How It Works

1. **User Input** — The user pastes a news headline and selects the relevant year.
2. **Prompt Engineering** — A structured prompt is sent to the Gemini AI model, instructing it to act as a rigorous fact-checker.
3. **Web Grounding** — The model searches the live web to find credible sources from the specified year.
4. **Structured Response Parsing** — The AI returns a machine-readable response with `STATUS`, `SUMMARY`, `SOURCE`, and `DATE` fields.
5. **Result Display** — The app renders the verdict with color-coded UI and linked sources for transparency.

```
User Input → Gemini AI (with web search) → Structured Parse → Visual Verdict + Sources
```

---

## 📸 Screenshots

> _Add screenshots here once the app is deployed or running locally._

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## ⚠️ Disclaimer

This tool is built for **educational and informational purposes only**. AI-based fact-checking should not be used as the sole source of truth. Always cross-reference with multiple reputable sources before drawing conclusions about any news content.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ using React 

</div>
