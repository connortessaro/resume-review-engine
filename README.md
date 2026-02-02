# Resume Review Engine

A web-based application that analyzes and rewrites full resume text while providing structured explanations for suggested improvements.

The system is designed to support **iterative resume refinement**, helping users improve clarity, wording, and structure rather than blindly replacing their content.

---

## Overview

Users can submit complete resume sections and receive:

* a rewritten version with improved clarity and phrasing
* a structured explanation describing why changes were made

The goal is to make resume feedback understandable and actionable, not opaque or one-click generated.

---

## Core Features

* Full resume rewrite generation
* Clear explanations for wording and structural changes
* Side-by-side comparison of original and revised content
* Local history tracking for previous rewrites
* Minimal, focused interface designed for usability

---

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/f0759063-a329-46c6-b10c-0de36a189448" width="800" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/9554a67f-12e1-4a66-a49d-802105771f41" width="800" />
</p>

---

## Tech Stack

* Next.js (App Router)
* TypeScript
* React
* Tailwind CSS
* Hugging Face Inference API

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

* Resume rewrites and explanations are generated separately to preserve clarity.
* Feedback prioritizes specificity, readability, and professional tone.
* Output is intended to guide revision, not replace user judgment.

---

## Planned Improvements

* More structured feedback categories
* Stronger evaluation of impact and specificity
* Improved section-aware formatting
* Optional scoring or categorization of resume strength
* Backend persistence for saved resumes
