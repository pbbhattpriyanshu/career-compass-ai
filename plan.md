

# Personalized Career & Education Advisor

## Overview
An AI-powered web app where students input their profile and receive personalized career suggestions, skill recommendations, and advice.

## Page: Home / Advisor

### Input Form
- **Interests** — comma-separated text input (e.g., "machine learning, web development, data science")
- **Degree** — dropdown select (e.g., Computer Science, Business, Engineering, Arts, etc.)
- **CGPA** — number input with validation (0.0 – 4.0 scale)
- **Career Goal** — text input (e.g., "become a data scientist")
- **"Get Recommendation" button** — triggers AI analysis

### Results Section (appears after submission)
- **3 Career Suggestions** — displayed as cards with title, brief description, and relevance indicator
- **Skills to Learn** — list of recommended skills shown as badges/tags
- **AI Advice** — a short personalized paragraph of guidance

### Design & UX
- Clean, modern single-page layout
- Loading state with skeleton/spinner while AI generates results
- Mobile-responsive design
- Ability to clear and start over

## Backend
- Supabase edge function calling Lovable AI (Gemini) to generate career recommendations based on the student's input
- Structured output via tool calling to return consistent career suggestions, skills, and advice

