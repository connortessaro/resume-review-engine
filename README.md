<div align="center">

# 📄 Resume Review Engine

**AI-powered resume analysis that rewrites and explains — so you stay in control.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Hugging Face](https://img.shields.io/badge/Hugging_Face-Inference_API-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/inference-api)

A web-based application that analyzes and rewrites full resume text while providing structured explanations for suggested improvements. Designed for **iterative resume refinement** — improving clarity, wording, and structure without blindly replacing your content.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Design Notes](#design-notes)
- [Planned Improvements](#planned-improvements)

---

## Overview

Users can submit complete resume sections and receive:

- ✍️ A **rewritten version** with improved clarity and phrasing
- 💡 A **structured explanation** describing why changes were made

The goal is to make resume feedback understandable and actionable — not opaque or one-click generated.

---

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/f0759063-a329-46c6-b10c-0de36a189448" width="800" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/9554a67f-12e1-4a66-a49d-802105771f41" width="800" />
</p>

---

## Core Features

| Feature | Description |
|---|---|
| 📝 Full Resume Rewrite | Generate a polished rewrite of submitted resume content |
| 💬 Change Explanations | Receive clear reasoning behind every wording and structural change |
| 🔍 Side-by-Side Comparison | Compare original and revised content at a glance |
| 🕒 Local History | Track and revisit up to 10 previous rewrites using browser storage |
| 🎯 Focused Interface | Minimal UI designed for clarity and usability |

---

## Tech Stack

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Full-stack React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [React 19](https://react.dev/) | UI layer |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Hugging Face Inference API](https://huggingface.co/inference-api) | AI-powered text generation |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Hugging Face](https://huggingface.co/) account and API token

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/connortessaro/resume-review-engine.git
   cd resume-review-engine
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```env
   HUGGINGFACE_API_KEY=your_token_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
app/
  api/              Server-side inference logic
  components/       UI components
lib/                Prompts and shared utilities
```

---

## Design Notes

- Resume rewrites and explanations are generated **separately** to preserve clarity.
- Feedback prioritizes **specificity, readability, and professional tone**.
- Output is intended to **guide revision**, not replace user judgment.

---

## Planned Improvements

- [ ] More structured feedback categories
- [ ] Stronger evaluation of impact and specificity
- [ ] Improved section-aware formatting
- [ ] Optional scoring or categorization of resume strength
- [ ] Backend persistence for saved resumes
