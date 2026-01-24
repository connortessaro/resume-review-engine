# Resume Review Engine

A web-based application for analyzing and rewriting full resume text with structured feedback.

---

## Overview

This project allows users to submit complete resume content and receive:

- a revised version with improved clarity and wording
- an explanation outlining the changes made

The system is designed to support iterative resume improvement through clear, readable output.

---

## Features

- Full resume rewrite generation
- Explanations for wording and structural changes
- Side-by-side comparison of original and revised content
- Local history tracking for previous submissions
- Minimal interface focused on usability

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Hugging Face Inference API

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

- Rewrites and explanations are generated separately to keep reasoning clear.
- The system prioritizes clarity, specificity, and stronger phrasing.
- Output is intended to support revision, not replace user judgment.

---

## Planned Improvements

- More structured feedback categories
- Stronger evaluation of impact and specificity
- Improved formatting and section awareness
- Optional scoring or categorization of resume strength
- Backend persistence for saved resumes
